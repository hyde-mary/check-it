const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const prisma = new PrismaClient();

const getUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.body;

    // haba pero just to exclude the password
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        middleName: true,
        email: true,
        birthday: true,
        height: true,
        weight: true,
        bmi: true,
        gender: true,
        activityLevel: true,
        goals: true,
        caloricIntake: true,
        paymentOptions: true,
        address: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user by ID error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const calculateCaloricIntake = (user) => {
  const { birthday, gender, weight, height, activityLevel, goals } = user;

  const birthDate = new Date(birthday);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

  let baseCalories =
    gender === "Female"
      ? 655.1 + 9.563 * weight + 1.85 * height - 4.676 * age
      : 66.47 + 13.75 * weight + 5.003 * height - 6.755 * age;

  const activityMultipliers = {
    Sedentary: 1.2,
    LightlyActive: 1.55,
    HighlyActive: 1.9,
  };

  const activityMultiplier = activityMultipliers[activityLevel] || 1.2;

  let adjustedCalories = baseCalories * activityMultiplier;

  if (goals === "GainWeight") {
    adjustedCalories += 300;
  } else if (goals === "LoseWeight") {
    adjustedCalories -= 300;
  }

  const protein = (adjustedCalories * 0.3) / 4;
  const carbs = (adjustedCalories * 0.5) / 4;
  const fat = (adjustedCalories * 0.2) / 9;

  return { caloricIntake: Math.round(adjustedCalories), protein, carbs, fat };
};

const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      middleName,
      email,
      password,
      birthday,
      height,
      weight,
      gender,
      activityLevel,
      goals,
    } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userHeight = parseFloat(height) / 100;
    const userWeight = parseFloat(weight);
    const userBirthday = new Date(birthday);
    const bmi = userWeight / (userHeight * userHeight);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        middleName,
        email,
        password: hashedPassword,
        birthday: userBirthday,
        height: parseFloat(height),
        weight: userWeight,
        bmi,
        gender,
        activityLevel,
        goals,
      },
    });

    const { caloricIntake, protein, carbs, fat } = calculateCaloricIntake({
      birthday: userBirthday,
      gender,
      weight: userWeight,
      height: userHeight,
      activityLevel,
      goals,
    });

    await prisma.userCaloricIntake.create({
      data: {
        userId: newUser.id,
        caloricIntake,
        protein,
        carbs,
        fat,
      },
    });

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      userId: newUser.id,
    });
  } catch (error) {
    console.error("Registration error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Login successful", token, userId: user.id });
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const update = async (req, res) => {
  try {
    const { user } = req.body;

    const {
      id,
      firstName,
      lastName,
      email,
      height,
      weight,
      activityLevel,
      goals,
      paymentOption,
      address,
    } = user;

    if (!id) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        height,
        weight,
        activityLevel,
        goals,
      },
    });

    const { caloricIntake, protein, carbs, fat } = calculateCaloricIntake({
      birthday: updatedUser.birthday,
      gender: updatedUser.gender,
      weight: updatedUser.weight,
      height: updatedUser.height,
      activityLevel: updatedUser.activityLevel,
      goals: updatedUser.goals,
    });

    await prisma.userCaloricIntake.upsert({
      where: { userId: id },
      update: { caloricIntake, protein, carbs, fat },
      create: { userId: id, caloricIntake, protein, carbs, fat },
    });

    if (
      paymentOption?.cardNumber &&
      paymentOption?.expirationDate &&
      paymentOption?.cardCv
    ) {
      const existingPaymentOption = await prisma.paymentOption.findFirst({
        where: { userId: id },
      });

      let expirationDateISO;

      // If expirationDate is a Date object, keep it.
      if (paymentOption.expirationDate instanceof Date) {
        expirationDateISO = paymentOption.expirationDate;
      }
      // If expirationDate is an ISO string (from DB), convert it.
      else if (!isNaN(Date.parse(paymentOption.expirationDate))) {
        expirationDateISO = new Date(paymentOption.expirationDate);
      }
      // If it's a "yyyy-mm" string, format it.
      else {
        expirationDateISO = new Date(
          `${paymentOption.expirationDate}-01T00:00:00.000Z`
        );
      }

      // Ensure the date is valid before proceeding
      if (!expirationDateISO || isNaN(expirationDateISO.getTime())) {
        return res
          .status(400)
          .json({ error: "Invalid expiration date format." });
      }

      updatedPaymentOption = await prisma.paymentOption.upsert({
        where: existingPaymentOption
          ? { id: existingPaymentOption.id }
          : { id: -1 },
        update: {
          cardNumber: paymentOption.cardNumber,
          expirationDate: expirationDateISO,
          cardCv: paymentOption.cardCv,
          cardholderName: `${updatedUser.firstName} ${updatedUser.lastName}`,
        },
        create: {
          userId: id,
          cardNumber: paymentOption.cardNumber,
          expirationDate: expirationDateISO,
          cardCv: paymentOption.cardCv,
          cardholderName: `${updatedUser.firstName} ${updatedUser.lastName}`,
        },
      });
    }

    let updatedAddress = null;
    if (
      address?.street &&
      address?.city &&
      address?.state &&
      address?.zipCode
    ) {
      updatedAddress = await prisma.address.upsert({
        where: { userId: id },
        update: {
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
        },
        create: {
          userId: id,
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
        },
      });
    }

    res.json({
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Update error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getUser, register, login, update, getUserById };

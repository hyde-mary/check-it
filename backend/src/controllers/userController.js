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
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        middleName: newUser.middleName,
        lastName: newUser.lastName,
        email: newUser.email,
        birthday: newUser.birthday,
        height: newUser.height,
        weight: newUser.weight,
        bmi,
        gender: newUser.gender,
        activityLevel: newUser.activityLevel,
        goals: newUser.goals,
      },
      caloricIntake: {
        caloricIntake,
        protein,
        carbs,
        fat,
      },
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

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const update = async (req, res) => {
  try {
    let {
      id,
      firstName,
      lastName,
      email,
      height,
      weight,
      activityLevel,
      goals,
      cardNumber,
      expiryDate,
      cvc,
      street,
      city,
      state,
      zipCode,
    } = req.body;

    id = Number(id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const emailExists = await prisma.user.findFirst({
      where: { email, NOT: { id } },
    });
    if (emailExists) {
      return res.status(400).json({ error: "Email is already in use." });
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

    let paymentOption = null;
    if (cardNumber && expiryDate && cvc) {
      const existingPaymentOption = await prisma.paymentOption.findFirst({
        where: { userId: id },
      });

      if (existingPaymentOption) {
        paymentOption = await prisma.paymentOption.update({
          where: { id: existingPaymentOption.id },
          data: {
            cardNumber,
            cardCv: cvc,
            expirationDate: new Date(expiryDate),
            cardholderName: `${updatedUser.firstName} ${updatedUser.lastName}`,
          },
        });
      } else {
        paymentOption = await prisma.paymentOption.create({
          data: {
            cardNumber,
            cardCv: cvc,
            expirationDate: new Date(expiryDate),
            cardholderName: `${updatedUser.firstName} ${updatedUser.lastName}`,
            userId: id,
          },
        });
      }
    }

    let address = null;
    if (street && city && state && zipCode) {
      const existingAddress = await prisma.address.findUnique({
        where: { userId: id },
      });

      if (existingAddress) {
        address = await prisma.address.update({
          where: { userId: id },
          data: { street, city, state, zipCode },
        });
      } else {
        address = await prisma.address.create({
          data: { userId: id, street, city, state, zipCode },
        });
      }
    }

    res.json({
      message: "Update successful",
      updatedUser: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        height: updatedUser.height,
        weight: updatedUser.weight,
        activityLevel: updatedUser.activityLevel,
        goals: updatedUser.goals,
      },
      caloricIntake: { caloricIntake, protein, carbs, fat },
      paymentOption: paymentOption
        ? {
            paymentId: paymentOption.id,
            cardNumber: paymentOption.cardNumber,
            cardCv: paymentOption.cardCv,
            expirationDate: paymentOption.expirationDate,
            cardholderName: paymentOption.cardholderName,
          }
        : null,
      address: address
        ? {
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
          }
        : null,
    });
  } catch (error) {
    console.error("Update error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getUser, register, login, update };

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const prisma = new PrismaClient();

const getUsers = async (req, res) => {
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
    const { id } = req.params;

    // haba pero just to exclude the password
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
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

const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return bmi;
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

    const userHeight = parseFloat(height);
    const userWeight = parseFloat(weight);
    const userBirthday = new Date(birthday);
    const bmi = calculateBMI(weight, height);

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
      expiresIn: "1d",
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

    const { caloricIntake, protein, carbs, fat } = calculateCaloricIntake(user);

    await prisma.userCaloricIntake.upsert({
      where: { userId: user.id },
      update: { caloricIntake, protein, carbs, fat },
      create: { userId: user.id, caloricIntake, protein, carbs, fat },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Login successful", token, userId: user.id });
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid User ID." });
    }

    const {
      firstName,
      lastName,
      email,
      height,
      weight,
      activityLevel,
      goals,
      paymentOption,
      address,
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // current caloric intake = we can use this to get the current caloric intake of the user
    // meaning, when the user consumed a food already
    const currentCaloricIntake = await prisma.userCaloricIntake.findUnique({
      where: { userId: id },
    });

    console.log("current caloric intake: ", currentCaloricIntake);

    const user = await prisma.user.findUnique({
      where: { id },
    });

    // now we get the defaultCaloricintake of the user before update.
    const defaultCaloricintake = calculateCaloricIntake(user);

    console.log("default caloric intake: ", defaultCaloricintake);

    // now we update the user
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

    // then we get the updated caloric intake.
    const updatedDefaultCaloricIntake = calculateCaloricIntake(updatedUser);

    console.log(
      "updated default caloric intake: ",
      updatedDefaultCaloricIntake
    );

    if (
      currentCaloricIntake.caloricIntake !== defaultCaloricintake.caloricIntake
    ) {
      // so what this means is that, the user consumed a food
      // so if the user consumed a food, we need to only add or subtract the difference between the new default and the default
      if (
        defaultCaloricintake.caloricIntake <
        updatedDefaultCaloricIntake.caloricIntake
      ) {
        // so if it is less than, it means the caloric intake increased
        await prisma.userCaloricIntake.update({
          where: { userId: id },
          data: {
            caloricIntake:
              currentCaloricIntake.caloricIntake +
              (updatedDefaultCaloricIntake.caloricIntake -
                defaultCaloricintake.caloricIntake),
            protein:
              currentCaloricIntake.protein +
              (updatedDefaultCaloricIntake.protein -
                defaultCaloricintake.protein),
            carbs:
              currentCaloricIntake.carbs +
              (updatedDefaultCaloricIntake.carbs - defaultCaloricintake.carbs),
            fat:
              currentCaloricIntake.fat +
              (updatedDefaultCaloricIntake.fat - defaultCaloricintake.fat),
          },
        });
      } else {
        // it means it decreased. So we do the same thing but this time we just inverse it.
        await prisma.userCaloricIntake.update({
          where: { userId: id },
          data: {
            caloricIntake:
              currentCaloricIntake.caloricIntake -
              (defaultCaloricintake.caloricIntake -
                updatedDefaultCaloricIntake.caloricIntake),
            protein:
              currentCaloricIntake.protein -
              (defaultCaloricintake.protein -
                updatedDefaultCaloricIntake.protein),
            carbs:
              currentCaloricIntake.carbs -
              (defaultCaloricintake.carbs - updatedDefaultCaloricIntake.carbs),
            fat:
              currentCaloricIntake.fat -
              (defaultCaloricintake.fat - updatedDefaultCaloricIntake.fat),
          },
        });
      }
    } else {
      // since the default and before caloric intake is the same, the user has not consumed a food
      // we can just replace the actual caloric intake of the user to the updated caloric intake
      await prisma.userCaloricIntake.update({
        where: { userId: id },
        data: {
          caloricIntake: updatedDefaultCaloricIntake.caloricIntake,
          protein: updatedDefaultCaloricIntake.protein,
          carbs: updatedDefaultCaloricIntake.carbs,
          fat: updatedDefaultCaloricIntake.fat,
        },
      });
    }

    if (paymentOption) {
      const { cardNumber, expirationDate, cardCv } = paymentOption;

      if (cardNumber || expirationDate || cardCv) {
        let expirationDateISO;
        if (expirationDate instanceof Date) {
          expirationDateISO = expirationDate;
        } else if (!isNaN(Date.parse(expirationDate))) {
          expirationDateISO = new Date(expirationDate);
        } else {
          expirationDateISO = new Date(`${expirationDate}-01T00:00:00.000Z`);
        }

        if (!expirationDateISO || isNaN(expirationDateISO.getTime())) {
          return res
            .status(400)
            .json({ error: "Invalid expiration date format." });
        }

        const existingPaymentOption = await prisma.paymentOption.findFirst({
          where: { userId: id },
        });

        if (existingPaymentOption) {
          await prisma.paymentOption.update({
            where: { id: existingPaymentOption.id },
            data: {
              cardNumber,
              expirationDate: expirationDateISO,
              cardCv,
              cardholderName: `${updatedUser.firstName} ${updatedUser.lastName}`,
            },
          });
        } else {
          await prisma.paymentOption.create({
            data: {
              userId: id,
              cardNumber,
              expirationDate: expirationDateISO,
              cardCv,
              cardholderName: `${updatedUser.firstName} ${updatedUser.lastName}`,
            },
          });
        }
      } else {
        await prisma.paymentOption.deleteMany({
          where: { userId: id },
        });
      }
    }

    if (address) {
      await prisma.address.upsert({
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
    } else {
      await prisma.address.deleteMany({
        where: { userId: id },
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

const checkEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email) },
    });

    return res.json({ exists: !!user });
  } catch (error) {
    console.error("Update error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUsers,
  register,
  login,
  updateUser,
  getUserById,
  checkEmail,
};

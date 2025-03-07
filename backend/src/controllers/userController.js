const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
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

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        birthday: newUser.birthday,
        bmi,
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

module.exports = { getUser, register };

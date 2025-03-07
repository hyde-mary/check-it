const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUserCalories = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userCaloricIntake = await prisma.userCaloricIntake.findUnique({
      where: { userId },
    });

    res.json(userCaloricIntake);
  } catch (error) {
    console.error("Error fetching caloric intake:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getUserCalories };

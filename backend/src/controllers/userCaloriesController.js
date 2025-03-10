const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUserCalories = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Valid User ID is required" });
    }

    const userCaloricIntake = await prisma.userCaloricIntake.findUnique({
      where: { userId: Number(id) },
    });

    if (!userCaloricIntake) {
      return res.status(404).json({ error: "Caloric intake not found" });
    }

    res.json(userCaloricIntake);
  } catch (error) {
    console.error("Error fetching caloric intake:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getUserCalories };

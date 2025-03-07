const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getFoods = async (req, res) => {
  try {
    const foods = await prisma.food.findMany();
    res.json(foods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getFoods };

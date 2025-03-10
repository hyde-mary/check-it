const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getCategories = async (req, res) => {
  try {
    const category = await prisma.category.findMany();
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getCategories };

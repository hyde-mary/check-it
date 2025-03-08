const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllRestaurant = async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany();
    res.json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getAllRestaurant };

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

const getRestaurantFromId = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Request denied, no restaurant ID" });
    }

    const restaurant = await prisma.restaurant.findFirst({
      where: {
        id,
      },
    });

    if (!restaurant) {
      return res
        .status(400)
        .json({ error: "Request denied, no restaurant that matches that ID" });
    }

    res.json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getAllRestaurant, getRestaurantFromId };

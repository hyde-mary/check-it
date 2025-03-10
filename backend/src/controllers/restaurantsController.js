const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getRestaurants = async (req, res) => {
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
    const { id } = req.params;
    const restaurantId = Number(id);

    if (isNaN(restaurantId)) {
      return res.status(400).json({ error: "Invalid restaurant ID." });
    }

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return res
        .status(404)
        .json({ error: "No restaurant found with the given ID." });
    }

    res.json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getRestaurants, getRestaurantFromId };

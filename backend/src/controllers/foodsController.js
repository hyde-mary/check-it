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

const getFoodFromRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      return res
        .status(400)
        .json({ error: "Request denied, no restaurant ID" });
    }

    const foods = await prisma.food.findMany({
      where: {
        restaurantId: Number(restaurantId),
      },
      include: {
        category: true,
      },
    });

    res.json(foods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFoodById = async (req, res) => {
  try {
    const { foodId } = req.params;

    if (!foodId) {
      return res.status(400).json({ error: "Must provide food ID!" });
    }

    const food = await prisma.food.findFirst({
      where: {
        id: Number(foodId),
      },
    });

    if (!food) {
      return res.status(404).json({ error: "Food not found!" });
    }

    res.json(food);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getFoods, getFoodFromRestaurant, getFoodById };

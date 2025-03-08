const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");

const orderFood = async (req, res) => {
  try {
    const { userId, foodItems } = req.body;

    if (!userId || !Array.isArray(foodItems) || foodItems.length === 0) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const firstFoodItem = foodItems[0];
    const food = await prisma.food.findUnique({
      where: {
        id: firstFoodItem.foodId,
      },
      select: {
        restaurantId: true,
      },
    });

    if (!food || !food.restaurantId) {
      return res
        .status(400)
        .json({ error: "Invalid food item or missing restaurantId" });
    }

    console.log("userId", userId);
    console.log("foodItems", foodItems);
    console.log("restaurantId", food.restaurantId);

    const paymentOption = await prisma.paymentOption.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    console.log("paymentOption", paymentOption);

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        userId,
        cardNumber: paymentOption.cardNumber,
        cardCv: paymentOption.cardCv,
        expirationDate: paymentOption.expirationDate,
        cardholderName: paymentOption.cardholderName,
        transactionId: uuidv4(),
      },
    });

    const order = await prisma.order.create({
      data: {
        userId,
        restaurantId: food.restaurantId,
        paymentId: paymentMethod.paymentId,
      },
    });

    const orderItems = await prisma.orderItem.createMany({
      data: foodItems.map((item) => ({
        orderId: order.orderId,
        foodId: item.foodId,
        quantity: item.quantity,
      })),
    });

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order.id,
      paymentId: paymentMethod.paymentId,
      orderItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { orderFood };

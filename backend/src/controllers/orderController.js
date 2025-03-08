const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");

const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const orders = await prisma.order.findMany({
      where: { userId: Number(userId) },
      orderBy: { orderTime: "desc" },
    });

    if (orders.length === 0) {
      return res.status(404).json({ error: "No orders found for this user" });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const orderFood = async (req, res) => {
  try {
    const { userId, foodItems, selectedPayment } = req.body;

    if (!userId || !Array.isArray(foodItems) || foodItems.length === 0) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const firstFoodItem = foodItems[0];
    const food = await prisma.food.findUnique({
      where: { id: firstFoodItem.foodId },
      select: { restaurantId: true },
    });

    if (!food || !food.restaurantId) {
      return res
        .status(400)
        .json({ error: "Invalid food item or missing restaurantId" });
    }

    let paymentMethod;

    console.log(selectedPayment);
    if (selectedPayment === "card") {
      const paymentOption = await prisma.paymentOption.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      if (!paymentOption) {
        return res
          .status(400)
          .json({ error: "No saved card found for this user" });
      }

      paymentMethod = await prisma.paymentMethod.create({
        data: {
          userId,
          type: "Card",
          cardNumber: paymentOption.cardNumber,
          cardCv: paymentOption.cardCv,
          expirationDate: paymentOption.expirationDate,
          cardholderName: paymentOption.cardholderName,
          transactionId: uuidv4(),
        },
      });
    } else if (selectedPayment === "cash") {
      paymentMethod = await prisma.paymentMethod.create({
        data: {
          userId,
          type: "Cash",
          cardNumber: null,
          cardCv: null,
          expirationDate: null,
          cardholderName: null,
          transactionId: uuidv4(),
        },
      });
    } else {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        restaurantId: food.restaurantId,
        paymentId: paymentMethod.paymentId,
        status: "Pending",
      },
    });

    await prisma.orderItem.createMany({
      data: foodItems.map((item) => ({
        orderId: order.orderId,
        foodId: item.foodId,
        quantity: item.quantity,
      })),
    });

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order.orderId,
      paymentId: paymentMethod.paymentId,
      paymentType: paymentMethod.type,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { orderFood, userOrders };

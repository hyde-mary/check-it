const express = require("express");
const {
  orderFood,
  getUserOrders,
  getPendingOrders,
  receive,
} = require("../controllers/ordersController");

const router = express.Router();

// GET

router.get("/userOrders/:userId", getUserOrders);
router.get("/pending/:userId", getPendingOrders);

// POST
router.post("/orderFood", orderFood);

// PUT
router.put("/receive/:orderId", receive);

module.exports = router;

const express = require("express");
const {
  orderFood,
  userOrders,
  pending,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/userOrders", userOrders);
router.post("/orderFood", orderFood);
router.post("/pending", pending);

module.exports = router;

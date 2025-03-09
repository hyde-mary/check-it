const express = require("express");
const {
  orderFood,
  userOrders,
  pending,
  receive,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/userOrders", userOrders);
router.post("/orderFood", orderFood);
router.post("/pending", pending);
router.post("/receive", receive);

module.exports = router;

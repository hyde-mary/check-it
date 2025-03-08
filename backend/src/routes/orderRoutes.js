const express = require("express");
const { orderFood, userOrders } = require("../controllers/orderController");

const router = express.Router();

router.post("/userOrders", userOrders);
router.post("/orderFood", orderFood);

module.exports = router;

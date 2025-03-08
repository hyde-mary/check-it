const express = require("express");
const { orderFood } = require("../controllers/orderController");

const router = express.Router();

router.post("/orderFood", orderFood);

module.exports = router;

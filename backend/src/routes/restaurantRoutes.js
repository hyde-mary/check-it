const express = require("express");
const { getAllRestaurant } = require("../controllers/restaurantController");

const router = express.Router();

router.get("/", getAllRestaurant);

module.exports = router;

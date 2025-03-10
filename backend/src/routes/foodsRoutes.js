const express = require("express");
const {
  getFoods,
  getFoodFromRestaurant,
  getFoodById,
} = require("../controllers/foodsController");

const router = express.Router();

router.get("/", getFoods);
router.get("/restaurant/:restaurantId", getFoodFromRestaurant);
router.get("/getFoodById/:foodId", getFoodById);

module.exports = router;

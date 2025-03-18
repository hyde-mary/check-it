const express = require("express");
const {
  getFoods,
  getFoodFromRestaurant,
  getFoodById,
  getFoodsByCategories,
} = require("../controllers/foodsController");

const router = express.Router();

router.get("/", getFoods);
router.get("/restaurant/:restaurantId", getFoodFromRestaurant);
router.get("/getFoodById/:foodId", getFoodById);
router.get("/categories/:categoryIds", getFoodsByCategories);

module.exports = router;

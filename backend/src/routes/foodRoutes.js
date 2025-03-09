const express = require("express");
const {
  getFoods,
  getFoodFromRestaurant,
  getFoodById,
} = require("../controllers/foodController");

const router = express.Router();

router.get("/", getFoods);
router.post("/restaurant", getFoodFromRestaurant);
router.post("/getFoodById", getFoodById);

module.exports = router;

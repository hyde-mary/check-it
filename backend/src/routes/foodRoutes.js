const express = require("express");
const {
  getFoods,
  getFoodFromRestaurant,
} = require("../controllers/foodController");

const router = express.Router();

router.get("/", getFoods);
router.post("/restaurant", getFoodFromRestaurant);

module.exports = router;

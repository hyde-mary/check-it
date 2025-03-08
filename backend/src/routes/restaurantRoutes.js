const express = require("express");
const {
  getAllRestaurant,
  getRestaurantFromId,
} = require("../controllers/restaurantController");

const router = express.Router();

router.get("/", getAllRestaurant);
router.post("/id", getRestaurantFromId);

module.exports = router;

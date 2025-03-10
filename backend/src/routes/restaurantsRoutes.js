const express = require("express");
const {
  getRestaurants,
  getRestaurantFromId,
} = require("../controllers/restaurantsController");

const router = express.Router();

router.get("/", getRestaurants);
router.get("/:id", getRestaurantFromId);

module.exports = router;

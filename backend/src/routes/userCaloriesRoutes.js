const express = require("express");
const { getUserCalories } = require("../controllers/userCaloriesController");

const router = express.Router();

router.get("/:id", getUserCalories);

module.exports = router;

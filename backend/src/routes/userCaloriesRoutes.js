const express = require("express");
const { getUserCalories } = require("../controllers/userCaloriesController");

const router = express.Router();

router.post("/userCalories", getUserCalories);

module.exports = router;

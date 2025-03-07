const express = require("express");
const { getMeal } = require("../controllers/mealController");

const router = express.Router();

router.post("/", getMeal);

module.exports = router;

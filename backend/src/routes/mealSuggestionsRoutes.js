const express = require("express");
const {
  getMealSuggestions,
} = require("../controllers/mealSuggestionsController");

const router = express.Router();

router.get("/", getMealSuggestions);

module.exports = router;

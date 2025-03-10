const express = require("express");
const cors = require("cors");

const usersRoutes = require("./routes/usersRoutes");
const foodsRoutes = require("./routes/foodsRoutes");
const userCaloriesRoutes = require("./routes/userCaloriesRoutes");
const restaurantsRoutes = require("./routes/restaurantsRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const ordersRoutes = require("./routes/ordersRoutes");

const mealSuggestionsRoutes = require("./routes/mealSuggestionsRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", usersRoutes);
app.use("/api/foods", foodsRoutes);
app.use("/api/user-calories", userCaloriesRoutes);
app.use("/api/restaurants", restaurantsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/orders", ordersRoutes);

// ai meal suggestions
app.use("/api/ai/meal-suggestions", mealSuggestionsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

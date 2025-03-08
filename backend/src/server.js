const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const foodRoutes = require("./routes/foodRoutes");
const userCaloriesRoutes = require("./routes/userCaloriesRoutes");
const mealRoutes = require("./routes/mealRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/foods", foodRoutes);
app.use("/calories", userCaloriesRoutes);
app.use("/meal", mealRoutes);
app.use("/restaurant", restaurantRoutes);
app.use("/category", categoryRoutes);
app.use("/order", orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const foodRoutes = require("./routes/foodRoutes");
const userCaloriesRoutes = require("./routes/userCalories");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/foods", foodRoutes);
app.use("/calories", userCaloriesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

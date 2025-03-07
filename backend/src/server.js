const express = require("express");
const cors = require("cors");
const foodRoutes = require("./routes/foodRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/foods", foodRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

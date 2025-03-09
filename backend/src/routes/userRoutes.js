const express = require("express");
const {
  getUser,
  register,
  login,
  update,
  getUserById,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getUser);
router.post("/register", register);
router.post("/login", login);
router.put("/update", update);
router.post("/getUserById", getUserById);

module.exports = router;

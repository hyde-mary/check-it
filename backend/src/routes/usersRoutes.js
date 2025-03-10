const express = require("express");
const {
  getUsers,
  register,
  login,
  updateUser,
  getUserById,
} = require("../controllers/usersController");

const router = express.Router();

// GET

router.get("/", getUsers);
router.get("/user/:id", getUserById);

// POST
router.post("/register", register);
router.post("/login", login);

// PUT
router.put("/user/:id", updateUser);

module.exports = router;

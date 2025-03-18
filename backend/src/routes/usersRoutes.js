const express = require("express");
const {
  getUsers,
  register,
  login,
  updateUser,
  getUserById,
  checkEmail,
} = require("../controllers/usersController");

const router = express.Router();

// GET

router.get("/", getUsers);
router.get("/user/:id", getUserById);
router.get("/check-email", checkEmail);

// POST
router.post("/register", register);
router.post("/login", login);

// PUT
router.put("/user/:id", updateUser);

module.exports = router;

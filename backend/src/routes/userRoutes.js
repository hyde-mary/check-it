const express = require("express");
const { getUser, register, login } = require("../controllers/userController");

const router = express.Router();

router.get("/", getUser);
router.post("/register", register);
router.post("/login", login);

module.exports = router;

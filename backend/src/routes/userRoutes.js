const express = require("express");
const { getUser, register } = require("../controllers/userController");

const router = express.Router();

router.get("/", getUser);
router.post("/register", register);

module.exports = router;

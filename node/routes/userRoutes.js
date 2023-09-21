const express = require("express");

const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signupValidation, authController.signup);

router.post("/login", authController.loginValidation, authController.login);

module.exports = router;

const express = require("express");
const { body } = require("express-validator");
const { signup, login, logout } = require("./../controllers/authController");

const userRoutes = express.Router();

userRoutes.post(
  "/signup",
  [
    body("name", "The name length must be at least 3").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  signup
);

userRoutes.post(
  "/login",
  [
    body("email", "Enter a valid email").exists().isEmail(),
    body("password", "Password must be at least 5 characters")
      .exists()
      .isLength({
        min: 5,
      }),
  ],
  login
);

userRoutes.delete("/logout", logout);

module.exports = userRoutes;

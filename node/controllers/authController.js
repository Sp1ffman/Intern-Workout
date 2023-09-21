const { body, validationResult } = require("express-validator");
const userModel = require("../models/userModel");
const signupValidation = [
  body("id", "The ID must be alphanumeric").isAlphanumeric(),
  body("name", "The name length must be at least 3 characters").isLength({
    min: 3,
  }),
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password must be at least 5 characters").isLength({
    min: 5,
  }),
];

const loginValidation = [
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password must be at least 5 characters").isLength({
    min: 5,
  }),
];

function signup(req, res) {
  const { id, name, email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  userModel.hashPassword(password, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }

    const newUser = {
      Id: id,
      Name: name,
      Email: email,
      Password: hashedPassword,
      Created_at: new Date(),
      Updated_at: new Date(),
    };

    userModel.createUser(newUser, (err, data) => {
      if (err) {
        console.error("Error creating user:", err);
        return res.status(403).json({
          error: "User with those credentials already exists",
          message: err.message,
        });
      }

      userModel.generateToken(data.insertId, (err, token) => {
        if (err) {
          return res.status(500).json({ error: "Internal server error" });
        }

        res.status(201).json({ message: "User created successfully", token });
      });
    });
  });
}

function login(req, res) {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  userModel.findUserByEmail(email, (err, user) => {
    if (err) {
      console.error("Error finding user:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    userModel.comparePassword(password, user.Password, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result) {
        userModel.generateToken(user.Id, (err, token) => {
          if (err) {
            return res.status(500).json({ error: "Internal server error" });
          }

          res.json({ status: "success", token });
          console.log("Login Successful");
        });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    });
  });
}

module.exports = {
  signup,
  login,
  signupValidation,
  loginValidation,
};

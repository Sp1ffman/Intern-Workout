const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const UserModel = require("./../models/userModel");

async function signup(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, name, email, password } = req.body;
    const newUser = { Id: id, Name: name, Email: email, Password: password };

    const hashedPassword = await bcrypt.hash(newUser.Password, 12);
    newUser.Password = hashedPassword;

    const result = await UserModel.createUser(newUser);

    const token = jwt.sign(
      { userId: result.insertId },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function login(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await UserModel.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.Password);

    if (passwordMatch) {
      const token = jwt.sign({ userId: user.Id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      res.json({ status: "success", token });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
const tokens = [];

async function logout(req, res) {
  try {
    const token = req.headers["authorization"].split(" ")[1];

    const index = tokens.indexOf(token);
    if (index !== -1) {
      return res.status(401).json({ error: "Token already invalidated" });
    }

    tokens.push(token);

    console.log("Token deleted", tokens);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { signup, login, logout };

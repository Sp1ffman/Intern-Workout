const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ path: "./../views/config/config.env" });

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: "patient_records",
});

connection.connect((err) => {
  if (err) {
    console.error("Could not connect to the database\n", err);
    return;
  }
  console.log("Connected to MySQL database");
});

async function createUser(newUser) {
  try {
    const hashedPassword = await bcrypt.hash(newUser.Password, 12);
    const user = {
      Id: newUser.Id,
      Name: newUser.Name,
      Email: newUser.Email,
      Password: hashedPassword,
      Created_at: new Date(),
      Updated_at: new Date(),
    };

    const data = await connection.query(
      "INSERT INTO User (Id,Name, Email, Password, Created_at, Updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [
        user.Id,
        user.Name,
        user.Email,
        user.Password,
        user.Created_at,
        user.Updated_at,
      ]
    );

    return data;
  } catch (error) {
    throw {
      error: "User with that credentials already exists",
      message: error.message,
    };
  }
}

async function getUserByEmail(email) {
  try {
    const results = await connection.query(
      "SELECT * FROM user WHERE Email = ?",
      [email]
    );

    return results.length > 0 ? results[0] : null;
  } catch (error) {
    throw { error: "Internal server error" };
  }
}

module.exports = { createUser, getUserByEmail };

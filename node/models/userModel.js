const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config/config.env" });

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

function createUser(newUser, callback) {
  const query =
    "INSERT INTO User (Id, Name, Email, Password, Created_at, Updated_at) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [
    newUser.Id,
    newUser.Name,
    newUser.Email,
    newUser.Password,
    newUser.Created_at,
    newUser.Updated_at,
  ];

  connection.query(query, values, (err, data) => {
    if (err) {
      console.error("There was a problem in creating the user:", err);
      return callback(err, null);
    }
    callback(null, data);
  });
}

function findUserByEmail(email, callback) {
  const query = "SELECT * FROM User WHERE Email = ?";
  connection.query(query, [email], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length === 0) {
      return callback(null, null);
    }
    callback(null, results[0]);
  });
}

function generateToken(userId, callback) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  callback(null, token);
}

function verifyToken(token, callback) {
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, decoded);
  });
}

function hashPassword(password, callback) {
  bcrypt.hash(password, 12, (err, hash) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, hash);
  });
}

function comparePassword(password, hash, callback) {
  bcrypt.compare(password, hash, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
}

module.exports = {
  createUser,
  findUserByEmail,
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
};

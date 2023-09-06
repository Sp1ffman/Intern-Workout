const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { body, validationResult } = require("express-validator");
dotenv.config({ path: "./../config.env" });
const app = express();
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

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

app.post(
  "/api/signup",
  [
    body("name", "The name length must be atleast 3").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password Cannot be blank").exists(),
    body("password", "Password must atleast be 5 characters")
      .isLength({
        min: 5,
      })
      .exists(),
  ],
  (req, res) => {
    const { id, name, email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    bcrypt.hash(password, 12, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }

      const newUser = {
        Id: id,
        Name: name,
        Email: email,
        Password: hash,
        Created_at: new Date(),
        Updated_at: new Date(),
      };

      connection.query(
        "INSERT INTO User (Id,Name, Email, Password, Created_at, Updated_at) VALUES (?,?, ?, ?, ?, ?)",
        [
          newUser.Id,
          newUser.Name,
          newUser.Email,
          newUser.Password,
          newUser.Created_at,
          newUser.Updated_at,
        ],
        (err, data) => {
          if (err) {
            console.error("There is a problem in registering the user:", err);
            return res.status(403).json({
              error: "User with that credentials already exists",
              message: err.message,
            });
          }

          const token = jwt.sign(
            { userId: data.insertId },
            process.env.JWT_SECRET,
            {
              expiresIn: process.env.JWT_EXPIRES_IN,
            }
          );

          res
            .status(201)
            .json({ message: "User registered successfully", token });
        }
      );
    });
  }
);

app.post(
  "/api/login",
  [
    body("email", "Enter a valid email").exists().isEmail(),
    body("password", "Password Cannot be blank").exists(),
    body("password", "Password must atleast be 5 characters").isLength({
      min: 5,
    }),
  ],
  (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    connection.query(
      "SELECT * FROM user WHERE Email = ?",
      [email],
      (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
          res.status(401).json({ error: "Invalid credentials" });
        } else {
          const user = results[0];
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) throw err;

            if (result) {
              const token = jwt.sign(
                { userId: user.Id },
                process.env.JWT_SECRET,
                {
                  expiresIn: process.env.JWT_EXPIRES_IN,
                }
              );
              res.json({ status: "success", token });
              console.log("Login Successful");
            } else {
              res.status(401).json({ error: "Invalid credentials" });
            }
          });
        }
      }
    );
  }
);
async function verifyToken(req, res, next) {
  try {
    let token = req.headers["authorization"].split(" ");
    const decoded = await jwt.verify(token[1], process.env.JWT_SECRET);
    req.userId = decoded.userId;
    console.log(req.userId);
    console.log("Token verification successful");
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid User" });
  }
}

app.get("/api/getclaims", verifyToken, (req, res) => {
  connection.query("SELECT * FROM claims", (err, results) => {
    if (err) {
      console.error("Error fetching claims:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.json({ claims: results });
  });
});
// app.get("/api/getclaims", verifyToken, (req, res) => {
//   // Pagination support
//   const page = req.query.page || 1;
//   const pageSize = 10; // Number of records per page

//   const startIndex = (page - 1) * pageSize;

//   connection.query(
//     "SELECT * FROM claims LIMIT ?, ?",
//     [startIndex, pageSize],
//     (err, results) => {
//       if (err) {
//         console.error("Error fetching claims:", err);
//         return res.status(500).json({ error: "Internal server error" });
//       }

//       res.json({ claims: results });
//     }
//   );
// });

const tokens = [];

app.delete("/api/logout", verifyToken, (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    tokens.splice(tokens.indexOf(token), 1);
    console.log("Token deleted", tokens);

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(8000, () => {
  console.log(`Server is running on port ${PORT}`);
});

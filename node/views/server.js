const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { body, validationResult } = require("express-validator");
dotenv.config({ path: "./config/config.env" });
const app = require("./app");
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
  "/api/user/signup",
  [
    body("name", "The name length must be at least 3").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password Cannot be blank").exists(),
    body("password", "Password must at least be 5 characters")
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
            console.error("Unable to register the user:", err);
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
  "/api/user/login",
  [
    body("email", "Enter a valid email").exists().isEmail(),
    body("password", "Password Cannot be blank").exists(),
    body("password", "Password must at least be 5 characters").isLength({
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

app.get("/api/claims/getclaims", verifyToken, (req, res) => {
  connection.query("SELECT * FROM claims", (err, results) => {
    if (err) {
      console.error("Error fetching claims:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.json({ claims: results });
  });
});

app.get("/api/claims/getclaims/:id", verifyToken, (req, res) => {
  const claimId = req.params.id;

  connection.query(
    "SELECT * FROM claims WHERE id = ?",
    [claimId],
    (err, results) => {
      if (err) {
        console.error("Error fetching claim by ID:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Claim not found" });
      }

      const claim = results[0];
      res.json({ claim });
    }
  );
});

app.patch("/api/claims/updateclaim/:id", verifyToken, (req, res) => {
  const claimId = req.params.id;
  const updatedClaimData = req.body;

  connection.query(
    "UPDATE claims SET ? WHERE id = ?",
    [updatedClaimData, claimId],
    (err, results) => {
      if (err) {
        console.error("Error updating claim:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      res.json({ message: "Claim updated successfully" });
    }
  );
});

app.delete("/api/claims/deleteclaim/:id", verifyToken, (req, res) => {
  const claimId = req.params.id;

  connection.query(
    "DELETE FROM claims WHERE id = ?",
    [claimId],
    (err, results) => {
      if (err) {
        console.error("Error deleting claim:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      res.json({ message: "Claim deleted successfully" });
    }
  );
});

const tokens = [];

app.delete("/api/user/logout", verifyToken, (req, res) => {
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

app.patch("/api/claims/updatepatient/:id", verifyToken, (req, res) => {
  const patientId = req.params.id;
  const updatedPatientData = req.body;

  connection.query(
    "UPDATE claims SET ? WHERE id = ?",
    [updatedPatientData, patientId],
    (err, results) => {
      if (err) {
        console.error("Error updating patient:", err);
      }

      res.json({ message: "Patient updated successfully" });
    }
  );
});

app.delete("/api/claims/deletepatient/:id", verifyToken, (req, res) => {
  const patientId = req.params.id;

  connection.query(
    "DELETE FROM claims WHERE id = ?",
    [patientId],
    (err, results) => {
      if (err) {
        console.error("Error deleting patient:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      res.json({ message: "Patient deleted successfully" });
    }
  );
});

app.post(
  "/api/claims/addclaim",
  verifyToken,
  [
    body("Id", "Patient ID cannot be blank").exists(),
    body("user_id", "User ID cannot be blank").exists(),
    body("patient", "Patient name cannot be blank").exists(),
    body("Filed_Date", "Filed date cannot be blank").exists(),
    body("Service_Date", "Service date cannot be blank").exists(),
    body("Fees", "Fees cannot be blank").exists(),
    body("reimbursement1", "Reimbursement details cannot be blank").exists(),
    body("reimbursement2", "Reimbursement details cannot be blank").exists(),
    body("payer_name", "Payer name cannot be blank").exists(),
  ],
  (req, res) => {
    const {
      Id,
      user_id,
      patient,
      Filed_Date,
      Service_Date,
      Fees,
      reimbursement1,
      reimbursement2,
      payer_name,
    } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newClaim = {
      Id,
      user_id,
      patient,
      Filed_Date,
      Service_Date,
      Fees,
      reimbursement1,
      reimbursement2,
      payer_name,
    };

    connection.query(
      "INSERT INTO claims (Id,user_id,patient, Filed_Date, Service_Date, Fees,reimbursement1,reimbursement2,payer_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        newClaim.Id,
        newClaim.user_id,
        newClaim.patient,
        newClaim.Filed_Date,
        newClaim.Service_Date,
        newClaim.Fees,
        newClaim.reimbursement1,
        newClaim.reimbursement2,
        newClaim.payer_name,
      ],
      (err, results) => {
        if (err) {
          console.error("Unable to add new claim:", err);
          return res.status(500).json({
            error: "Error adding new claim",
            message: err.message,
          });
        }

        res.status(201).json({ message: "New claim added successfully" });
      }
    );
  }
);

const PORT = process.env.PORT || 3000;
app.listen(8000, () => {
  console.log(`Server is running on port ${PORT}`);
});

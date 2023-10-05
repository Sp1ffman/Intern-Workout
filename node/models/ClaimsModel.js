const mysql = require("mysql");
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

async function createClaim(newClaim, res) {
  try {
    const data = await connection.query(
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
      ]
    );

    return res.json({ message: "New claim added successfully" });
  } catch (error) {
    console.error("Unable to add new claim:", error);
    return res.status(500).json({
      error: "Error adding new claim",
      message: error.message,
    });
  }
}

async function getClaimById(claimId, res) {
  try {
    const results = await connection.query(
      "SELECT * FROM claims WHERE id = ?",
      [claimId]
    );

    if (results.length > 0) {
      return res.json({ claim: results[0] });
    } else {
      return res.status(404).json({ error: "Claim not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updateClaim(claimId, updatedClaimData, res) {
  try {
    const results = await connection.query("UPDATE claims SET ? WHERE id = ?", [
      updatedClaimData,
      claimId,
    ]);

    return res.json({ message: "Claim updated successfully" });
  } catch (error) {
    console.error("Error updating claim:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteClaim(claimId, res) {
  try {
    const results = await connection.query("DELETE FROM claims WHERE id = ?", [
      claimId,
    ]);

    return res.json({ message: "Claim deleted successfully" });
  } catch (error) {
    console.error("Error deleting claim:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getClaims(res) {
  try {
    const results = await connection.query("SELECT * FROM claims");

    return res.json({ claims: results });
  } catch (error) {
    console.error("Error fetching claims:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createClaim,
  getClaimById,
  updateClaim,
  deleteClaim,
  getClaims,
};

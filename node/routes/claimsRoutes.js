const express = require("express");
const { body } = require("express-validator");
const {
  getClaims,
  getClaimByIdHandler,
  addNewClaim,
  updateClaimHandler,
  deleteClaimHandler,
} = require("../controllers/ClaimsController");
const verifyToken = require("../middlewares/AuthMiddleware");

const claimsRoutes = express.Router();

claimsRoutes.get("/getclaims", verifyToken, getClaims);

claimsRoutes.get("/getclaims/:id", verifyToken, getClaimByIdHandler);

claimsRoutes.post(
  "/addclaim",
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
  addNewClaim
);

claimsRoutes.patch("/updateclaim/:id", verifyToken, updateClaimHandler);
claimsRoutes.delete("/deleteclaim/:id", verifyToken, deleteClaimHandler);

module.exports = claimsRoutes;

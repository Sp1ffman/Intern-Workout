const express = require("express");
const { body } = require("express-validator");
const claimsController = require("../controllers/ClaimsController");

const authMiddleware = require("../middlewares/AuthMiddleware");

const claimsRoutes = express.Router();

claimsRoutes.get(
  "/getclaims",
  authMiddleware.verifyToken,
  claimsController.getClaims
);

claimsRoutes.get(
  "/getclaims/:id",
  authMiddleware.verifyToken,
  claimsController.getClaimByIdHandler
);

claimsRoutes.post(
  "/addclaim",
  authMiddleware.verifyToken,
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
  claimsController.addNewClaim
);

claimsRoutes.patch(
  "/updateclaim/:id",
  authMiddleware.verifyToken,
  claimsController.updateClaimHandler
);
claimsRoutes.delete(
  "/deleteclaim/:id",
  authMiddleware.verifyToken,
  claimsController.deleteClaimHandler
);

module.exports = claimsRoutes;

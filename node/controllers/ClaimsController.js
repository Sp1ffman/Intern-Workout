const { validationResult } = require("express-validator");
const { verifyToken } = require("../middlewares/AuthMiddleware");
const {
  createClaim,
  getClaimById,
  updateClaim,
  deleteClaim,
  getClaims,
} = require("../models/ClaimsModel");

async function addNewClaim(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await verifyToken(req, res);

    const newClaimData = req.body;
    await createClaim(newClaimData);
    return res.status(201).json({ message: "New claim added successfully" });
  } catch (error) {
    console.error("Error adding new claim:", error);
    return res.status(500).json({
      error: "Error adding new claim",
      message: error.message,
    });
  }
}

async function getClaimByIdHandler(req, res) {
  try {
    await verifyToken(req, res);

    const claimId = req.params.id;
    const claim = await getClaimById(claimId);

    if (!claim) {
      return res.status(404).json({ error: "Claim not found" });
    }

    return res.json({ claim });
  } catch (error) {
    console.error("Error fetching claim by ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updateClaimHandler(req, res) {
  try {
    await verifyToken(req, res);

    const claimId = req.params.id;
    const updatedClaimData = req.body;

    await updateClaim(claimId, updatedClaimData);
    return res.json({ message: "Claim updated successfully" });
  } catch (error) {
    console.error("Error updating claim:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteClaimHandler(req, res) {
  try {
    await verifyToken(req, res);

    const claimId = req.params.id;
    await deleteClaim(claimId);
    return res.json({ message: "Claim deleted successfully" });
  } catch (error) {
    console.error("Error deleting claim:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  addNewClaim,
  getClaimByIdHandler,
  updateClaimHandler,
  deleteClaimHandler,
  getClaims,
};

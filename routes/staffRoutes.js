const express = require("express");
const router = express.Router();
const {
  manageTourPost,
  manageTourPut,
  manageTourDelete,
  getCustomers,
  getSchedules,
  createQuote
} = require("../controllers/staffController");
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");

// Tour management (OPERATOR)
router.post("/tours", verifyToken, authorizeRoles("OPERATOR", "ADMIN"), manageTourPost);
router.put("/tours/:id", verifyToken, authorizeRoles("OPERATOR", "ADMIN"), manageTourPut);
router.delete("/tours/:id", verifyToken, authorizeRoles("OPERATOR", "ADMIN"), manageTourDelete);

// Customer management (OPERATOR)
router.get("/customers", verifyToken, authorizeRoles("OPERATOR", "ADMIN"), getCustomers);

// Schedules (GUIDE)
router.get("/schedules", verifyToken, authorizeRoles("GUIDE", "ADMIN"), getSchedules);

// Quotes (SALE)
router.post("/quotes", verifyToken, authorizeRoles("SALE", "ADMIN"), createQuote);

module.exports = router;

const express = require("express");
const router = express.Router();
const { createInvoice, getFinancialReport } = require("../controllers/accountantController");
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");

// Invoices
router.post("/invoices", verifyToken, authorizeRoles("ACCOUNTANT", "ADMIN"), createInvoice);

// Financial Reports
router.get("/reports/financial", verifyToken, authorizeRoles("ACCOUNTANT", "ADMIN", "MANAGER"), getFinancialReport);

module.exports = router;

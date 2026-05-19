const express = require("express");
const router = express.Router();
const { getTours, createBooking, cancelBooking } = require("../controllers/customerController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Public routes
router.get("/tours", getTours);

// Protected routes
router.post("/bookings", verifyToken, createBooking);
router.put("/bookings/:id/cancel", verifyToken, cancelBooking);

module.exports = router;

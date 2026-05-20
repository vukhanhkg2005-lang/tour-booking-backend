const express = require("express");
const router = express.Router();
const { 
  getTours, 
  getTourById, 
  createBooking, 
  cancelBooking, 
  getBookings, 
  getMyInvoices, 
  createTicket,
  getTourReviews,
  createTourReview
} = require("../controllers/customerController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Public routes
router.get("/tours", getTours);
router.get("/tours/:id", getTourById);
router.get("/tours/:id/reviews", getTourReviews);
router.post("/tickets", createTicket);

// Protected routes
router.get("/bookings/my", verifyToken, getBookings);
router.get("/bookings/invoices", verifyToken, getMyInvoices);
router.post("/bookings", verifyToken, createBooking);
router.put("/bookings/:id/cancel", verifyToken, cancelBooking);
router.post("/tours/:id/reviews", verifyToken, createTourReview);

module.exports = router;

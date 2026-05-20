const express = require("express");
const router = express.Router();
const {
  manageTourPost,
  manageTourPut,
  manageTourDelete,
  getCustomers,
  getSchedules,
  createQuote,
  updateBookingStatus,
  getTickets,
  updateTicket,
  triggerPreTripReminders
} = require("../controllers/staffController");
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");

// Tour management (OPERATOR)
router.post("/tours", verifyToken, authorizeRoles("OPERATOR", "ADMIN"), manageTourPost);
router.put("/tours/:id", verifyToken, authorizeRoles("OPERATOR", "ADMIN"), manageTourPut);
router.delete("/tours/:id", verifyToken, authorizeRoles("OPERATOR", "ADMIN"), manageTourDelete);

// Customer management (OPERATOR)
router.get("/customers", verifyToken, authorizeRoles("OPERATOR", "ADMIN"), getCustomers);

// Schedules (GUIDE, OPERATOR, SALE, ADMIN, MANAGER, ACCOUNTANT)
router.get("/schedules", verifyToken, authorizeRoles("GUIDE", "OPERATOR", "SALE", "ADMIN", "MANAGER", "ACCOUNTANT"), getSchedules);

// Quotes (SALE)
router.post("/quotes", verifyToken, authorizeRoles("SALE", "ADMIN"), createQuote);

// Booking confirmation/status update (OPERATOR, GUIDE, SALE, ADMIN)
router.put("/bookings/:id/status", verifyToken, authorizeRoles("OPERATOR", "GUIDE", "SALE", "ADMIN"), updateBookingStatus);

// Tickets management (OPERATOR, MANAGER, ADMIN)
router.get("/tickets", verifyToken, authorizeRoles("OPERATOR", "MANAGER", "ADMIN"), getTickets);
router.put("/tickets/:id", verifyToken, authorizeRoles("OPERATOR", "MANAGER", "ADMIN"), updateTicket);

// Departure reminder triggers (OPERATOR, MANAGER, ADMIN)
router.post("/send-reminders", verifyToken, authorizeRoles("OPERATOR", "MANAGER", "ADMIN"), triggerPreTripReminders);

module.exports = router;

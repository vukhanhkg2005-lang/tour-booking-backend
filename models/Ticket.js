const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, default: "" },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["Booking", "Refund", "Technical", "Feedback", "General Inquiry"],
    default: "General Inquiry"
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },
  status: {
    type: String,
    enum: ["New", "In Progress", "Resolved"],
    default: "New"
  },
  reply: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Ticket", TicketSchema);

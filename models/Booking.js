const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
  bookingDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
    default: "PENDING"
  },
  paymentStatus: {
    type: String,
    enum: ["UNPAID", "PARTIAL", "PAID", "REFUNDED"],
    default: "UNPAID"
  },
  participants: { type: Number, required: true, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);

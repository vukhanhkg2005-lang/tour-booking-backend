const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  accountant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["UNPAID", "PAID", "CANCELLED"],
    default: "UNPAID"
  },
  issuedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Invoice", InvoiceSchema);

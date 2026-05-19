const mongoose = require("mongoose");

const QuoteSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
  saleStaff: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quotedPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "REJECTED"],
    default: "PENDING"
  },
  validUntil: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Quote", QuoteSchema);

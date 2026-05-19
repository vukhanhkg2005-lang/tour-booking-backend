const mongoose = require("mongoose");

const TourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  destination: { type: String, required: true },
  durationDays: { type: Number, required: true },
  maxParticipants: { type: Number, required: true },
  currentParticipants: { type: Number, default: 0 },
  startDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Tour", TourSchema);

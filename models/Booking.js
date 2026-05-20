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

// Helper function to update a Tour's currentParticipants count
const updateTourParticipants = async function(tourId) {
  try {
    const Tour = mongoose.model("Tour");
    const Booking = mongoose.model("Booking");

    // Sum up participants of all bookings that are NOT CANCELLED
    const result = await Booking.aggregate([
      { $match: { tour: tourId, status: { $ne: "CANCELLED" } } },
      { $group: { _id: null, total: { $sum: "$participants" } } }
    ]);

    const total = result.length > 0 ? result[0].total : 0;
    await Tour.findByIdAndUpdate(tourId, { currentParticipants: total });
    console.log(`Updated Tour ${tourId} currentParticipants to ${total}`);
  } catch (err) {
    console.error(`Error updating participants for tour ${tourId}:`, err);
  }
};

// Post-save hook to update participants count on Tour
BookingSchema.post("save", async function(doc) {
  if (doc.tour) {
    await updateTourParticipants(doc.tour);
  }
});

// Post-remove/deleteOne hook to update participants count on Tour
BookingSchema.post("remove", async function(doc) {
  if (doc.tour) {
    await updateTourParticipants(doc.tour);
  }
});

// Also support deleteOne middleware
BookingSchema.post("deleteOne", { document: true, query: false }, async function(doc) {
  if (doc.tour) {
    await updateTourParticipants(doc.tour);
  }
});

module.exports = mongoose.model("Booking", BookingSchema);


const Tour = require("../models/Tour");
const Booking = require("../models/Booking");

const getTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBooking = async (req, res) => {
  const { tourId, numberOfPeople, totalPrice } = req.body;
  try {
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      tour: tourId,
      participants: numberOfPeople,
      status: "PENDING",
      paymentStatus: "UNPAID"
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    booking.status = "CANCELLED";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTours, createBooking, cancelBooking };

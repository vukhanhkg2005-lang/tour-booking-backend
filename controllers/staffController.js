const Tour = require("../models/Tour");
const User = require("../models/User");
const Booking = require("../models/Booking");
const Quote = require("../models/Quote");

const manageTourPost = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json(tour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const manageTourPut = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tour) return res.status(404).json({ message: "Tour not found" });
    res.status(200).json(tour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const manageTourDelete = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) return res.status(404).json({ message: "Tour not found" });
    res.status(200).json({ message: "Tour deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "CUSTOMER" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSchedules = async (req, res) => {
  try {
    const schedules = await Booking.find({ status: "CONFIRMED" })
      .populate("tour", "name destination startDate durationDays")
      .populate("user", "name email");
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createQuote = async (req, res) => {
  const { customerId, tourId, quotedPrice, validUntil } = req.body;
  try {
    const quote = await Quote.create({
      customer: customerId,
      tour: tourId,
      saleStaff: req.user._id,
      quotedPrice,
      validUntil: validUntil || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    res.status(201).json(quote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  manageTourPost,
  manageTourPut,
  manageTourDelete,
  getCustomers,
  getSchedules,
  createQuote
};

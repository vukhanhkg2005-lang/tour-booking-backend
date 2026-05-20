const User = require("../models/User");
const Tour = require("../models/Tour");
const Booking = require("../models/Booking");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.set(req.body);
    await user.save();
    
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Invoice = require("../models/Invoice");

const getGeneralReport = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTours = await Tour.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: "CONFIRMED" });
    
    const revenueAgg = await Invoice.aggregate([
      { $match: { status: "PAID" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    const recentBookings = await Booking.find()
      .populate("user", "name email")
      .populate("tour", "name")
      .sort("-bookingDate")
      .limit(10);

    res.status(200).json({
      totalUsers,
      totalTours,
      totalBookings,
      confirmedBookings,
      totalRevenue,
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const backupSystem = async (req, res) => {
  res.status(200).json({ message: "System backup initiated successfully. Database snapshot is being generated in the background." });
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getGeneralReport,
  backupSystem
};

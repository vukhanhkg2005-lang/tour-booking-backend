const Tour = require("../models/Tour");
const Booking = require("../models/Booking");
const Invoice = require("../models/Invoice");
const Ticket = require("../models/Ticket");
const User = require("../models/User");
const Review = require("../models/Review");
const jwt = require("jsonwebtoken");

const getTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    res.status(200).json(tour);
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

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("tour");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyInvoices = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).select('_id');
    const bookingIds = bookings.map(b => b._id);
    
    const invoices = await Invoice.find({ booking: { $in: bookingIds } })
      .populate({
        path: 'booking',
        populate: { path: 'tour' }
      })
      .populate('accountant', 'name email')
      .sort({ issuedAt: -1 });

    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTicket = async (req, res) => {
  const { customerName, customerEmail, customerPhone, subject, message, category, priority } = req.body;
  try {
    let userId = null;
    let finalName = customerName;
    let finalEmail = customerEmail;
    let finalPhone = customerPhone;

    // Check optional bearer token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (user) {
          userId = user._id;
          finalName = user.name;
          finalEmail = user.email;
          finalPhone = user.phone || customerPhone;
        }
      } catch (err) {
        console.error("Optional token verification failed in createTicket:", err.message);
      }
    }

    const ticket = await Ticket.create({
      user: userId,
      customerName: finalName,
      customerEmail: finalEmail,
      customerPhone: finalPhone || "",
      subject,
      message,
      category: category || "General Inquiry",
      priority: priority || "Medium",
      status: "New"
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTourReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tour: req.params.id })
      .populate("user", "name role")
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTourReview = async (req, res) => {
  const { rating, comment } = req.body;
  try {
    // Check if the user has a confirmed/completed booking for this tour
    const booking = await Booking.findOne({
      user: req.user._id,
      tour: req.params.id,
      status: { $in: ["CONFIRMED", "COMPLETED"] }
    });

    if (!booking) {
      return res.status(403).json({ message: "Bạn chỉ có thể đánh giá tour sau khi đã đặt mua và được xác nhận!" });
    }

    // Create the review
    const review = await Review.create({
      user: req.user._id,
      tour: req.params.id,
      rating,
      comment
    });

    // Recalculate average rating & reviews count
    const reviews = await Review.find({ tour: req.params.id });
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 4.8;

    const tour = await Tour.findById(req.params.id);
    if (tour) {
      tour.rating = parseFloat(avgRating.toFixed(1));
      tour.reviews = totalReviews;
      await tour.save();
    }

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getTours, 
  getTourById, 
  createBooking, 
  cancelBooking, 
  getBookings, 
  getMyInvoices, 
  createTicket,
  getTourReviews,
  createTourReview
};

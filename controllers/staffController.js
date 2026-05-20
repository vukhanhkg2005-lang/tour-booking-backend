const Tour = require("../models/Tour");
const User = require("../models/User");
const Booking = require("../models/Booking");
const Quote = require("../models/Quote");
const Ticket = require("../models/Ticket");

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
    const schedules = await Booking.find()
      .populate("tour", "name destination startDate durationDays price image")
      .populate("user", "name email")
      .sort("-bookingDate");
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

const updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    await booking.save(); // This triggers our Booking post-save hook to update tour currentParticipants

    // Send booking confirmation email on status transition to CONFIRMED
    if (status === "CONFIRMED") {
      try {
        const populatedBooking = await Booking.findById(booking._id)
          .populate("user", "name email")
          .populate("tour");
        if (populatedBooking && populatedBooking.user && populatedBooking.user.email) {
          const { sendBookingConfirmation } = require("../services/emailService");
          await sendBookingConfirmation(
            populatedBooking.user.email,
            populatedBooking,
            populatedBooking.tour
          );
        }
      } catch (err) {
        console.error("Error triggering booking email confirmation:", err);
      }
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTicket = async (req, res) => {
  const { status, reply } = req.body;
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const originalReply = ticket.reply;
    if (status !== undefined) ticket.status = status;
    if (reply !== undefined) ticket.reply = reply;

    await ticket.save();

    // Trigger ticket reply email notification if reply is updated
    if (reply && reply !== originalReply && ticket.customerEmail) {
      try {
        const { sendTicketReplyNotification } = require("../services/emailService");
        await sendTicketReplyNotification(
          ticket.customerEmail,
          ticket.subject,
          reply
        );
      } catch (err) {
        console.error("Error triggering ticket reply email:", err);
      }
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const triggerPreTripReminders = async (req, res) => {
  try {
    const tomorrowStart = new Date();
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    tomorrowStart.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date();
    tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const tomorrowBookings = await Booking.find({
      status: "CONFIRMED",
      bookingDate: { $gte: tomorrowStart, $lte: tomorrowEnd }
    }).populate("user", "name email").populate("tour");

    const { sendDepartureReminder } = require("../services/emailService");
    let sentCount = 0;
    for (const booking of tomorrowBookings) {
      if (booking.user && booking.user.email && booking.tour) {
        await sendDepartureReminder(booking.user.email, booking.tour.name, booking.bookingDate);
        sentCount++;
      }
    }

    res.status(200).json({ 
      message: `Đã gửi thành công ${sentCount} email nhắc nhở khởi hành cho ngày mai.`, 
      count: sentCount 
    });
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
  createQuote,
  updateBookingStatus,
  getTickets,
  updateTicket,
  triggerPreTripReminders
};

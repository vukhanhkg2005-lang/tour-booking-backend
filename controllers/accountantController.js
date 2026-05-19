const Invoice = require("../models/Invoice");
const Booking = require("../models/Booking");

const createInvoice = async (req, res) => {
  const { bookingId, amount } = req.body;
  
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const invoice = await Invoice.create({
      booking: bookingId,
      accountant: req.user._id,
      amount: amount,
      status: "PAID"
    });

    booking.paymentStatus = "PAID";
    await booking.save();

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFinancialReport = async (req, res) => {
  try {
    const revenue = await Invoice.aggregate([
      { $match: { status: "PAID" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" }, invoiceCount: { $sum: 1 } } }
    ]);

    const report = revenue.length > 0 ? revenue[0] : { totalRevenue: 0, invoiceCount: 0 };
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createInvoice, getFinancialReport };

const getTours = async (req, res) => {
  res.json({ message: "Mock: Get all tours (Public)" });
};

const createBooking = async (req, res) => {
  res.json({ message: "Mock: Create a new booking (Require Auth)" });
};

const cancelBooking = async (req, res) => {
  res.json({ message: `Mock: Cancel booking with ID ${req.params.id} (Require Auth)` });
};

module.exports = { getTours, createBooking, cancelBooking };

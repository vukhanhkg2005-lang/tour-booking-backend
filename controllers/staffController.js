const manageTourPost = async (req, res) => { res.json({ message: "Mock: Create a tour (Operator only)" }); };
const manageTourPut = async (req, res) => { res.json({ message: "Mock: Update a tour (Operator only)" }); };
const manageTourDelete = async (req, res) => { res.json({ message: "Mock: Delete a tour (Operator only)" }); };

const getCustomers = async (req, res) => {
  res.json({ message: "Mock: Get all customers (Operator only)" });
};

const getSchedules = async (req, res) => {
  res.json({ message: "Mock: Get schedules for guide (Guide only)" });
};

const createQuote = async (req, res) => {
  res.json({ message: "Mock: Create a quote (Sale only)" });
};

module.exports = {
  manageTourPost,
  manageTourPut,
  manageTourDelete,
  getCustomers,
  getSchedules,
  createQuote
};

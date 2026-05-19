const createInvoice = async (req, res) => {
  res.json({ message: "Mock: Create/manage an invoice (Accountant only)" });
};

const getFinancialReport = async (req, res) => {
  res.json({ message: "Mock: Get financial report (Accountant only)" });
};

module.exports = { createInvoice, getFinancialReport };

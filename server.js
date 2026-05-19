require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Initialize App
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Import Routes
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const staffRoutes = require("./routes/staffRoutes");
const accountantRoutes = require("./routes/accountantRoutes");
const managerRoutes = require("./routes/managerRoutes");

// Use Routes
app.use("/api", authRoutes);
app.use("/api", customerRoutes);
app.use("/api", staffRoutes);
app.use("/api", accountantRoutes);
app.use("/api", managerRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.send("Welcome to Tour Booking Management System API");
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Connection Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoutes");
const billRoutes = require("./routes/billRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminBillRoutes = require("./routes/adminBillRoutes");
const adminPaymentRoutes = require("./routes/adminPaymentRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

app.use("/api/users", userRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/bills", adminBillRoutes);
app.use("/api/admin/payments", adminPaymentRoutes);
app.use("/api/complaints", complaintRoutes);

// Connect to MongoDB

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Test Route
app.get("/", (req, res) => {
  res.json({
    message: "DGPS Backend Server is running",
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `DGPS Backend Server is running on port ${PORT}`
  );
});
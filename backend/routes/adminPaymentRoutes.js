const express = require("express");
const router = express.Router();

const Payment = require("../models/Payment");
const User = require("../models/User");

// =====================================================
// GET ALL PAYMENTS - ADMIN
// =====================================================

router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ createdAt: -1 });

    // Add consumer name from User collection
    const paymentsWithConsumer = await Promise.all(
      payments.map(async (payment) => {
        const consumer = await User.findOne({
          consumerNumber: payment.consumerNumber,
        }).select(
          "name consumerNumber meterNumber mobile email"
        );

        return {
          ...payment.toObject(),

          consumer: consumer
            ? {
                _id: consumer._id,
                name: consumer.name,
                consumerNumber:
                  consumer.consumerNumber,
                meterNumber:
                  consumer.meterNumber,
                mobile: consumer.mobile,
                email: consumer.email,
              }
            : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      payments: paymentsWithConsumer,
    });
  } catch (error) {
    console.error(
      "Get All Payments Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load payments.",
      error: error.message,
    });
  }
});


// =====================================================
// DELETE PAYMENT - ADMIN
// =====================================================

router.delete("/:id", async (req, res) => {
  try {
    const payment = await Payment.findById(
      req.params.id
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    await Payment.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Payment Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to delete payment.",
      error: error.message,
    });
  }
});


module.exports = router;
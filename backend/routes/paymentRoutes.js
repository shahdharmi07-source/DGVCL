const express = require("express");
const router = express.Router();

const Payment = require("../models/Payment");
const Bill = require("../models/Bill");
const Notification = require("../models/Notification");

// ========================================
// PAY BILL
// ========================================

router.post("/pay", async (req, res) => {
  try {
    const {
      consumerNumber,
      billNumber,
      billMonth,
      amount,
      paymentMethod,
    } = req.body;

    // ========================================
    // CHECK REQUIRED DETAILS
    // ========================================

    if (
      !consumerNumber ||
      !billNumber ||
      !billMonth ||
      amount === undefined ||
      !paymentMethod
    ) {
      return res.status(400).json({
        message:
          "Please provide all payment details",
      });
    }

    // ========================================
    // FIND BILL
    // ========================================

    const bill = await Bill.findOne({
      consumerNumber: consumerNumber,
      billNumber: billNumber,
    });

    if (!bill) {
      return res.status(404).json({
        message: "Bill not found",
      });
    }

    // ========================================
    // CHECK ALREADY PAID
    // ========================================

    if (bill.status === "Paid") {
      return res.status(400).json({
        message:
          "This bill has already been paid",
      });
    }

    // ========================================
    // USE ACTUAL BILL AMOUNT
    // ========================================

    const paymentAmount = bill.billAmount;

    // ========================================
    // GENERATE TRANSACTION ID
    // ========================================

    const transactionId =
      "TXN" + Date.now();

    // ========================================
    // CREATE PAYMENT
    // ========================================

    const payment = new Payment({
      consumerNumber:
        consumerNumber,

      billNumber:
        billNumber,

      billMonth:
        bill.billingMonth,

      amount:
        paymentAmount,

      paymentMethod:
        paymentMethod,

      transactionId:
        transactionId,

      status:
        "Success",
    });

    // ========================================
    // SAVE PAYMENT
    // ========================================

    const savedPayment =
      await payment.save();

    // ========================================
    // UPDATE BILL STATUS
    // ========================================

    bill.status = "Paid";

    await bill.save();

    // ========================================
    // CREATE PAYMENT NOTIFICATION
    // ========================================

    const notification =
      new Notification({
        consumerNumber:
          consumerNumber,

        title:
          "Payment Successful",

        message:
          `Your electricity bill payment of ₹${paymentAmount} for ${bill.billingMonth} has been completed successfully. Transaction ID: ${transactionId}.`,

        type:
          "Payment",

        priority:
          "high",

        read:
          false,

        actionText:
          "View Payment",

        actionLink:
          "/payment-history",
      });

    await notification.save();

    // ========================================
    // RESPONSE
    // ========================================

    res.status(201).json({
      message:
        "Payment Successful",

      payment:
        savedPayment,

      bill:
        bill,

      notification:
        notification,
    });

  } catch (error) {
    console.error(
      "Payment Error:",
      error
    );

    res.status(500).json({
      message:
        "Payment Failed",

      error:
        error.message,
    });
  }
});

// ========================================
// GET PAYMENT HISTORY
// ========================================

router.get(
  "/:consumerNumber",
  async (req, res) => {
    try {
      const consumerNumber =
        req.params.consumerNumber;

      const payments =
        await Payment.find({
          consumerNumber:
            consumerNumber,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        payments:
          payments,
      });

    } catch (error) {
      console.error(
        "Payment History Error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to fetch payment history",

        error:
          error.message,
      });
    }
  }
);

module.exports = router;
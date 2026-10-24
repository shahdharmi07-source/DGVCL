const express = require("express");
const Bill = require("../models/Bill");
const Notification = require("../models/Notification");

const router = express.Router();


// ==================================================
// CREATE NEW BILL
// ==================================================

router.post("/create", async (req, res) => {
  try {
    const {
      consumerId,
      consumerNumber,
      billNumber,
      billingMonth,
      units,
      dueDate
    } = req.body;


    // ==================================================
    // CHECK REQUIRED FIELDS
    // ==================================================

    if (
      !consumerId ||
      !consumerNumber ||
      !billNumber ||
      !billingMonth ||
      units === undefined ||
      !dueDate
    ) {
      return res.status(400).json({
        message: "Please fill all required bill details"
      });
    }


    // ==================================================
    // CHECK DUPLICATE BILL
    // ==================================================

    const existingBill = await Bill.findOne({
      billNumber: billNumber
    });

    if (existingBill) {
      return res.status(400).json({
        message: "Bill with this bill number already exists"
      });
    }


    // ==================================================
    // BILL CALCULATION
    // ==================================================

    const ratePerUnit = 6.50;

    const usageCharge =
      units * ratePerUnit;

    const fixedCharge = 50;

    const additionalCharge = 20;

    const subtotal =
      usageCharge +
      fixedCharge +
      additionalCharge;

    const taxRate = 5;

    const tax =
      subtotal * (taxRate / 100);

    const previousDue = 0;

    const lateFee = 0;

    const credit = 0;

    const finalAmount =
      subtotal +
      tax +
      previousDue +
      lateFee -
      credit;

    const billAmount =
      Math.round(finalAmount);


    // ==================================================
    // CREATE BILL
    // ==================================================

    const newBill = new Bill({
      consumerId: consumerId,
      consumerNumber: consumerNumber,
      billNumber: billNumber,
      billingMonth: billingMonth,
      units: units,
      ratePerUnit: ratePerUnit,
      usageCharge: usageCharge,
      fixedCharge: fixedCharge,
      additionalCharge: additionalCharge,
      subtotal: subtotal,
      taxRate: taxRate,
      tax: tax,
      previousDue: previousDue,
      lateFee: lateFee,
      credit: credit,
      billAmount: billAmount,
      dueDate: dueDate,
      status: "Pending"
    });


    // ==================================================
    // SAVE BILL IN MONGODB
    // ==================================================

    await newBill.save();


    // ==================================================
    // CREATE NOTIFICATION
    // ==================================================

    const newNotification =
      new Notification({

        consumerNumber:
          consumerNumber,

        title:
          "Electricity Bill Generated",

        message:
          `Your electricity bill of ₹${billAmount} for ${billingMonth} has been generated successfully. Due date is ${new Date(dueDate).toLocaleDateString("en-IN")}.`,

        type:
          "Bill Due",

        priority:
          "high",

        read:
          false,

        actionText:
          "View Bill",

        actionLink:
          "/bills"
      });


    // ==================================================
    // SAVE NOTIFICATION IN MONGODB
    // ==================================================

    await newNotification.save();


    // ==================================================
    // SEND RESPONSE
    // ==================================================

    res.status(201).json({

      message:
        "Bill and notification generated successfully",

      bill:
        newBill,

      notification:
        newNotification,

      calculation: {

        units:
          units,

        ratePerUnit:
          ratePerUnit,

        usageCharge:
          usageCharge,

        fixedCharge:
          fixedCharge,

        additionalCharge:
          additionalCharge,

        subtotal:
          subtotal,

        taxRate:
          taxRate,

        tax:
          tax,

        previousDue:
          previousDue,

        lateFee:
          lateFee,

        credit:
          credit,

        billAmount:
          billAmount

      }

    });

  } catch (error) {

    console.error(
      "Bill Generation Error:",
      error
    );

    res.status(500).json({

      message:
        "Server error",

      error:
        error.message

    });

  }
});


// ==================================================
// GET ALL BILLS OF ONE CONSUMER
// ==================================================

router.get("/:consumerNumber", async (req, res) => {

  try {

    const consumerNumber =
      req.params.consumerNumber;

    const bills =
      await Bill.find({
        consumerNumber:
          consumerNumber
      }).sort({
        createdAt: -1
      });

    res.status(200).json({

      bills:
        bills

    });

  } catch (error) {

    console.error(
      "Get Bills Error:",
      error
    );

    res.status(500).json({

      message:
        "Server error",

      error:
        error.message

    });

  }

});


module.exports = router;
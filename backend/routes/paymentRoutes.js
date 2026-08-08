const express = require("express");
const router = express.Router();

const Payment = require("../models/Payment");
const Bill = require("../models/Bill");


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
      paymentMethod
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
          "Please provide all payment details"

      });

    }


    // ========================================
    // FIND BILL
    // ========================================

    const bill = await Bill.findOne({

      consumerNumber:
        consumerNumber,

      billNumber:
        billNumber

    });


    // ========================================
    // BILL NOT FOUND
    // ========================================

    if (!bill) {

      return res.status(404).json({

        message:
          "Bill not found"

      });

    }


    // ========================================
    // CHECK IF ALREADY PAID
    // ========================================

    if (bill.status === "Paid") {

      return res.status(400).json({

        message:
          "This bill has already been paid"

      });

    }


    // ========================================
    // GENERATE TRANSACTION ID
    // ========================================

    const transactionId =
      "TXN" +
      Date.now();


    // ========================================
    // CREATE PAYMENT
    // ========================================

    const payment = new Payment({

      consumerNumber:
        consumerNumber,

      billNumber:
        billNumber,

      billMonth:
        billMonth,

      amount:
        amount,

      paymentMethod:
        paymentMethod,

      transactionId:
        transactionId,

      status:
        "Success"

    });


    // ========================================
    // SAVE PAYMENT
    // ========================================

    const savedPayment =
      await payment.save();


    // ========================================
    // UPDATE BILL STATUS
    // Pending → Paid
    // ========================================

    bill.status = "Paid";

    await bill.save();


    // ========================================
    // SEND RESPONSE
    // ========================================

    res.status(201).json({

      message:
        "Payment Successful",

      payment:
        savedPayment,

      bill:
        bill

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
        error.message

    });

  }

});


// ========================================
// GET PAYMENT HISTORY
// ========================================

router.get("/:consumerNumber", async (req, res) => {

  try {

    const consumerNumber =
      req.params.consumerNumber;


    const payments =
      await Payment.find({

        consumerNumber:
          consumerNumber

      }).sort({

        createdAt:
          -1

      });


    res.status(200).json({

      payments:
        payments

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
        error.message

    });

  }

});


module.exports = router;
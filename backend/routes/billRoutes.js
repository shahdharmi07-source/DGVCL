const express = require("express");
const Bill = require("../models/Bill");

const router = express.Router();


// ==========================================
// CREATE NEW BILL
// ==========================================

router.post("/create", async (req, res) => {

  try {

    const {
      consumerNumber,
      billNumber,
      month,
      units,
      dueDate
    } = req.body;


    // Check required fields

    if (
      !consumerNumber ||
      !billNumber ||
      !month ||
      units === undefined ||
      !dueDate
    ) {

      return res.status(400).json({
        message: "Please fill all required bill details"
      });

    }


    // ==========================================
    // AUTOMATIC BILL CALCULATION
    // ==========================================

    let energyCharge = 0;


    // Simple tariff calculation
    // For academic project

    if (units <= 50) {

      energyCharge = units * 2;

    }

    else if (units <= 150) {

      energyCharge =
        (50 * 2) +
        ((units - 50) * 3);

    }

    else if (units <= 250) {

      energyCharge =
        (50 * 2) +
        (100 * 3) +
        ((units - 150) * 5);

    }

    else {

      energyCharge =
        (50 * 2) +
        (100 * 3) +
        (100 * 5) +
        ((units - 250) * 7);

    }


    // Fixed Charge

    const fixedCharge = 50;


    // Final Bill Amount

    const totalAmount =
      energyCharge + fixedCharge;


    // ==========================================
    // CREATE NEW BILL
    // ==========================================

    const newBill = new Bill({

      consumerNumber,

      billNumber,

      month,

      units,

      amount: totalAmount,

      dueDate,

      status: "Pending"

    });


    // ==========================================
    // SAVE BILL IN MONGODB
    // ==========================================

    await newBill.save();


    // ==========================================
    // SEND RESPONSE
    // ==========================================

    res.status(201).json({

      message: "Bill generated successfully",

      bill: newBill,

      calculation: {

        units: units,

        energyCharge: energyCharge,

        fixedCharge: fixedCharge,

        totalAmount: totalAmount

      }

    });


  } catch (error) {

    console.error(
      "Bill Generation Error:",
      error
    );


    res.status(500).json({

      message: "Server error",

      error: error.message

    });

  }

});


// ==========================================
// GET ALL BILLS OF ONE CONSUMER
// ==========================================

router.get("/:consumerNumber", async (req, res) => {

  try {

    const consumerNumber =
      req.params.consumerNumber;


    const bills = await Bill.find({

      consumerNumber: consumerNumber

    }).sort({

      createdAt: -1

    });


    res.status(200).json({

      bills: bills

    });


  } catch (error) {

    console.error(
      "Get Bills Error:",
      error
    );


    res.status(500).json({

      message: "Server error",

      error: error.message

    });

  }

});


module.exports = router;
const express = require("express");
const mongoose = require("mongoose");

const Bill = require("../models/Bill");
const User = require("../models/User");

const router = express.Router();


// =====================================================
// GET ALL BILLS - ADMIN
// =====================================================

router.get("/", async (req, res) => {
  try {

    const bills = await Bill.find()
      .sort({ createdAt: -1 })
      .lean();

    const finalBills = await Promise.all(

      bills.map(async (bill) => {

        let consumer = null;


        // =================================================
        // 1. TRY CONSUMER ID
        // =================================================

        if (
          bill.consumerId &&
          mongoose.Types.ObjectId.isValid(bill.consumerId)
        ) {

          consumer = await User.findById(
            bill.consumerId
          ).select(
            "name consumerNumber meterNumber mobile email"
          ).lean();

        }


        // =================================================
        // 2. IF CONSUMER ID NOT FOUND
        // SEARCH USING CONSUMER NUMBER
        // =================================================

        if (!consumer && bill.consumerNumber) {

          consumer = await User.findOne({
            consumerNumber: bill.consumerNumber
          })
            .select(
              "name consumerNumber meterNumber mobile email"
            )
            .lean();

        }


        // =================================================
        // RETURN BILL WITH CONSUMER INFORMATION
        // =================================================

        return {

          ...bill,

          consumerId: consumer
            ? consumer._id
            : bill.consumerId || null,

          consumerName: consumer
            ? consumer.name
            : "Unknown Consumer",

          consumerNumber: consumer
            ? consumer.consumerNumber
            : bill.consumerNumber,

          meterNumber: consumer
            ? consumer.meterNumber
            : "",

          mobile: consumer
            ? consumer.mobile
            : "",

          email: consumer
            ? consumer.email
            : "",

        };

      })

    );


    res.status(200).json({

      success: true,

      bills: finalBills,

    });


  } catch (error) {

    console.error(
      "Get All Bills Error:",
      error
    );


    res.status(500).json({

      success: false,

      message: "Unable to load bills.",

      error: error.message,

    });

  }
});


// =====================================================
// CREATE NEW BILL
// =====================================================

router.post("/create", async (req, res) => {

  try {

    const {
      consumerId,
      consumerNumber,
      billNumber,
      billingMonth,
      units,
      dueDate,
      status,
    } = req.body;


    // =================================================
    // REQUIRED FIELD CHECK
    // =================================================

    if (
      !consumerId ||
      !consumerNumber ||
      !billNumber ||
      !billingMonth ||
      units === undefined ||
      !dueDate
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Please fill all required bill details.",

      });

    }


    // =================================================
    // CHECK CONSUMER ID
    // =================================================

    if (
      !mongoose.Types.ObjectId.isValid(
        consumerId
      )
    ) {

      return res.status(400).json({

        success: false,

        message: "Invalid consumer ID.",

      });

    }


    // =================================================
    // FIND CONSUMER
    // =================================================

    const consumer = await User.findById(
      consumerId
    );


    if (!consumer) {

      return res.status(404).json({

        success: false,

        message: "Consumer not found.",

      });

    }


    // =================================================
    // CHECK BILL NUMBER
    // =================================================

    const existingBill = await Bill.findOne({

      billNumber: billNumber,

    });


    if (existingBill) {

      return res.status(400).json({

        success: false,

        message: "Bill number already exists.",

      });

    }


    // =================================================
    // UNITS
    // =================================================

    const numericUnits = Number(units);


    if (
      isNaN(numericUnits) ||
      numericUnits < 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Units must be a valid positive number.",

      });

    }


    // =================================================
    // BILL CALCULATION
    // =================================================

    let energyCharge = 0;


    if (numericUnits <= 50) {

      energyCharge =
        numericUnits * 2;

    }

    else if (numericUnits <= 150) {

      energyCharge =
        (50 * 2) +
        ((numericUnits - 50) * 3);

    }

    else if (numericUnits <= 250) {

      energyCharge =
        (50 * 2) +
        (100 * 3) +
        ((numericUnits - 150) * 5);

    }

    else {

      energyCharge =
        (50 * 2) +
        (100 * 3) +
        (100 * 5) +
        ((numericUnits - 250) * 7);

    }


    const fixedCharge = 50;


    const totalAmount =
      energyCharge + fixedCharge;


    // =================================================
    // CREATE BILL
    // =================================================

    const newBill = new Bill({

      consumerId: consumer._id,

      consumerNumber:
        consumer.consumerNumber ||
        consumerNumber,

      billNumber: billNumber,

      billingMonth: billingMonth,

      units: numericUnits,

      billAmount: totalAmount,

      dueDate: dueDate,

      status: status || "Pending",

    });


    await newBill.save();


    // =================================================
    // GET CREATED BILL WITH CONSUMER
    // =================================================

    const populatedBill =
      await Bill.findById(
        newBill._id
      )
        .populate(
          "consumerId",
          "name consumerNumber meterNumber mobile email"
        )
        .lean();


    res.status(201).json({

      success: true,

      message:
        "Bill generated successfully.",

      bill: {

        ...populatedBill,

        consumerName:
          populatedBill.consumerId?.name ||
          consumer.name ||
          "Unknown Consumer",

      },

      calculation: {

        units: numericUnits,

        energyCharge: energyCharge,

        fixedCharge: fixedCharge,

        totalAmount: totalAmount,

      },

    });


  } catch (error) {

    console.error(
      "Bill Generation Error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Unable to generate bill.",

      error: error.message,

    });

  }

});


// =====================================================
// UPDATE BILL
// =====================================================

router.put("/:id", async (req, res) => {

  try {

    const {
      consumerId,
      consumerNumber,
      billNumber,
      billingMonth,
      units,
      dueDate,
      status,
    } = req.body;


    const bill =
      await Bill.findById(
        req.params.id
      );


    if (!bill) {

      return res.status(404).json({

        success: false,

        message: "Bill not found.",

      });

    }


    // =================================================
    // UPDATE CONSUMER
    // =================================================

    if (consumerId) {

      if (
        !mongoose.Types.ObjectId.isValid(
          consumerId
        )
      ) {

        return res.status(400).json({

          success: false,

          message: "Invalid consumer ID.",

        });

      }


      const consumer =
        await User.findById(
          consumerId
        );


      if (!consumer) {

        return res.status(404).json({

          success: false,

          message: "Consumer not found.",

        });

      }


      bill.consumerId =
        consumer._id;

      bill.consumerNumber =
        consumer.consumerNumber ||
        consumerNumber;

    }


    // =================================================
    // OTHER FIELDS
    // =================================================

    if (consumerNumber) {

      bill.consumerNumber =
        consumerNumber;

    }


    if (billNumber) {

      bill.billNumber =
        billNumber;

    }


    if (billingMonth) {

      bill.billingMonth =
        billingMonth;

    }


    // =================================================
    // RECALCULATE AMOUNT
    // =================================================

    if (units !== undefined) {

      const numericUnits =
        Number(units);


      if (
        isNaN(numericUnits) ||
        numericUnits < 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Units must be a valid number.",

        });

      }


      let energyCharge = 0;


      if (numericUnits <= 50) {

        energyCharge =
          numericUnits * 2;

      }

      else if (numericUnits <= 150) {

        energyCharge =
          (50 * 2) +
          ((numericUnits - 50) * 3);

      }

      else if (numericUnits <= 250) {

        energyCharge =
          (50 * 2) +
          (100 * 3) +
          ((numericUnits - 150) * 5);

      }

      else {

        energyCharge =
          (50 * 2) +
          (100 * 3) +
          (100 * 5) +
          ((numericUnits - 250) * 7);

      }


      const fixedCharge = 50;

      const totalAmount =
        energyCharge + fixedCharge;


      bill.units =
        numericUnits;

      bill.billAmount =
        totalAmount;

    }


    if (dueDate) {

      bill.dueDate =
        dueDate;

    }


    if (status) {

      bill.status =
        status;

    }


    await bill.save();


    // =================================================
    // GET UPDATED CONSUMER
    // =================================================

    const updatedBill =
      await Bill.findById(
        bill._id
      )
        .populate(
          "consumerId",
          "name consumerNumber meterNumber mobile email"
        )
        .lean();


    res.status(200).json({

      success: true,

      message:
        "Bill updated successfully.",

      bill: {

        ...updatedBill,

        consumerName:
          updatedBill.consumerId?.name ||
          "Unknown Consumer",

      },

    });


  } catch (error) {

    console.error(
      "Update Bill Error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Unable to update bill.",

      error: error.message,

    });

  }

});


// =====================================================
// DELETE BILL
// =====================================================

router.delete("/:id", async (req, res) => {

  try {

    const bill =
      await Bill.findById(
        req.params.id
      );


    if (!bill) {

      return res.status(404).json({

        success: false,

        message: "Bill not found.",

      });

    }


    await Bill.findByIdAndDelete(
      req.params.id
    );


    res.status(200).json({

      success: true,

      message:
        "Bill deleted successfully.",

    });


  } catch (error) {

    console.error(
      "Delete Bill Error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Unable to delete bill.",

      error: error.message,

    });

  }

});


module.exports = router;
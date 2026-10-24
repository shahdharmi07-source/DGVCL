const express = require("express");

const mongoose = require("mongoose");

const Admin = require("../models/Admin");
const User = require("../models/User");

const router = express.Router();


// =====================================================
// CREATE ADMIN
// =====================================================

router.post("/create", async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;

    if (!name || !email || !password) {

      return res.status(400).json({
        message: "Name, email and password are required"
      });

    }

    const existingAdmin = await Admin.findOne({
      email: email.toLowerCase()
    });

    if (existingAdmin) {

      return res.status(400).json({
        message: "Admin already exists"
      });

    }

    const admin = new Admin({

      name,

      email: email.toLowerCase(),

      password,

      role: "admin"

    });

    await admin.save();

    res.status(201).json({

      message: "Admin created successfully",

      admin: {

        id: admin._id,

        name: admin.name,

        email: admin.email,

        role: admin.role

      }

    });

  } catch (error) {

    console.error("CREATE ADMIN ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

});


// =====================================================
// ADMIN LOGIN
// =====================================================

router.post("/login", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    if (!email || !password) {

      return res.status(400).json({
        message: "Email and password are required"
      });

    }

    const admin = await Admin.findOne({
      email: email.toLowerCase()
    });

    if (!admin) {

      return res.status(401).json({
        message: "Invalid admin email or password"
      });

    }

    if (admin.password !== password) {

      return res.status(401).json({
        message: "Invalid admin email or password"
      });

    }

    res.status(200).json({

      message: "Admin login successful",

      admin: {

        id: admin._id,

        name: admin.name,

        email: admin.email,

        role: admin.role

      }

    });

  } catch (error) {

    console.error("ADMIN LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

});


// =====================================================
// ADMIN DASHBOARD STATS
// =====================================================

router.get("/dashboard", async (req, res) => {

  try {

    const totalConsumers =
      await User.countDocuments({
        role: "consumer"
      });

    const activeConsumers =
      await User.countDocuments({
        role: "consumer",
        connectionStatus: "Active"
      });

    const inactiveConsumers =
      await User.countDocuments({
        role: "consumer",
        connectionStatus: {
          $ne: "Active"
        }
      });

    res.status(200).json({

      totalConsumers,

      activeConsumers,

      inactiveConsumers

    });

  } catch (error) {

    console.error("ADMIN DASHBOARD ERROR:", error);

    res.status(500).json({
      message: "Unable to load dashboard"
    });

  }

});


// =====================================================
// GET ALL CONSUMERS
// =====================================================

router.get("/users", async (req, res) => {

  try {

    const users = await User.find({
      role: "consumer"
    }).sort({
      createdAt: -1
    });

    res.status(200).json({
      users
    });

  } catch (error) {

    console.error("GET USERS ERROR:", error);

    res.status(500).json({
      message: "Unable to load consumers"
    });

  }

});


// =====================================================
// GET SINGLE CONSUMER
// =====================================================

router.get("/users/:id", async (req, res) => {

  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {

      return res.status(400).json({
        message: "Invalid consumer ID"
      });

    }

    const user = await User.findOne({

      _id: req.params.id,

      role: "consumer"

    });

    if (!user) {

      return res.status(404).json({
        message: "Consumer not found"
      });

    }

    res.status(200).json({
      user
    });

  } catch (error) {

    console.error("GET SINGLE USER ERROR:", error);

    res.status(500).json({
      message: "Unable to load consumer"
    });

  }

});


// =====================================================
// CREATE CONSUMER
// =====================================================

router.post("/users", async (req, res) => {

  try {

    const {
      name,
      consumerNumber,
      meterNumber,
      mobile,
      address,
      email,
      connectionStatus
    } = req.body;


    if (
      !name ||
      !consumerNumber ||
      !meterNumber ||
      !mobile ||
      !address
    ) {

      return res.status(400).json({

        message:
          "Name, consumer number, meter number, mobile and address are required"

      });

    }


    const existingConsumer =
      await User.findOne({

        $or: [

          {
            consumerNumber
          },

          {
            mobile
          }

        ],

        role: "consumer"

      });


    if (existingConsumer) {

      return res.status(400).json({

        message:
          "Consumer number or mobile number already exists"

      });

    }


    const user = new User({

      name,

      consumerNumber,

      meterNumber,

      mobile,

      address,

      email: email || "",

      connectionStatus:
        connectionStatus || "Active",

      role: "consumer"

    });


    await user.save();


    res.status(201).json({

      message:
        "Consumer created successfully",

      user

    });


  } catch (error) {

    console.error(
      "CREATE CONSUMER ERROR:",
      error
    );


    if (error.code === 11000) {

      return res.status(400).json({

        message:
          "Consumer number or mobile number already exists"

      });

    }


    res.status(500).json({

      message:
        "Unable to create consumer"

    });

  }

});


// =====================================================
// UPDATE CONSUMER
// =====================================================

router.put("/users/:id", async (req, res) => {

  try {

    const id = req.params.id;


    // CHECK MONGODB ID

    if (!mongoose.Types.ObjectId.isValid(id)) {

      return res.status(400).json({

        message: "Invalid consumer ID"

      });

    }


    const {
      name,
      consumerNumber,
      meterNumber,
      mobile,
      address,
      email,
      connectionStatus
    } = req.body;


    // REQUIRED FIELDS

    if (
      !name ||
      !consumerNumber ||
      !meterNumber ||
      !mobile ||
      !address
    ) {

      return res.status(400).json({

        message:
          "Name, consumer number, meter number, mobile and address are required"

      });

    }


    // CHECK CURRENT CONSUMER

    const currentConsumer =
      await User.findOne({

        _id: id,

        role: "consumer"

      });


    if (!currentConsumer) {

      return res.status(404).json({

        message:
          "Consumer not found"

      });

    }


    // CHECK DUPLICATE

    const existingConsumer =
      await User.findOne({

        $or: [

          {
            consumerNumber
          },

          {
            mobile
          }

        ],

        _id: {
          $ne: id
        },

        role: "consumer"

      });


    if (existingConsumer) {

      return res.status(400).json({

        message:
          "Consumer number or mobile number already exists"

      });

    }


    // UPDATE

    currentConsumer.name =
      name.trim();

    currentConsumer.consumerNumber =
      consumerNumber.trim();

    currentConsumer.meterNumber =
      meterNumber.trim();

    currentConsumer.mobile =
      mobile.trim();

    currentConsumer.address =
      address.trim();

    currentConsumer.email =
      email ? email.trim() : "";

    currentConsumer.connectionStatus =
      connectionStatus || "Active";


    await currentConsumer.save();


    res.status(200).json({

      message:
        "Consumer updated successfully",

      user:
        currentConsumer

    });


  } catch (error) {

    console.error(
      "UPDATE CONSUMER ERROR:",
      error
    );


    if (error.code === 11000) {

      return res.status(400).json({

        message:
          "Consumer number or mobile number already exists"

      });

    }


    res.status(500).json({

      message:
        "Unable to update consumer"

    });

  }

});


// =====================================================
// DELETE CONSUMER
// =====================================================

router.delete("/users/:id", async (req, res) => {

  try {

    const id = req.params.id;


    // CHECK ID

    if (!mongoose.Types.ObjectId.isValid(id)) {

      return res.status(400).json({

        message:
          "Invalid consumer ID"

      });

    }


    // FIND CONSUMER

    const user =
      await User.findOne({

        _id: id,

        role: "consumer"

      });


    if (!user) {

      return res.status(404).json({

        message:
          "Consumer not found"

      });

    }


    // DELETE

    await User.deleteOne({

      _id: id,

      role: "consumer"

    });


    res.status(200).json({

      message:
        "Consumer deleted successfully"

    });


  } catch (error) {

    console.error(
      "DELETE CONSUMER ERROR:",
      error
    );


    res.status(500).json({

      message:
        "Unable to delete consumer"

    });

  }

});


module.exports = router;
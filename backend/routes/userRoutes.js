const express = require("express");
const User = require("../models/User");

const router = express.Router();


// ===============================
// REGISTER USER
// ===============================

router.post("/register", async (req, res) => {

  try {

    const {
      name,
      consumerNumber,
      meterNumber,
      mobile,
      address,
      email
    } = req.body;


    // Check existing user
    const existingUser = await User.findOne({
      $or: [
        { consumerNumber: consumerNumber },
        { mobile: mobile }
      ]
    });


    if (existingUser) {

      return res.status(400).json({
        message: "Consumer Number or Mobile Number already registered"
      });

    }


    // Create new user
    const newUser = new User({

      name,
      consumerNumber,
      meterNumber,
      mobile,
      address,
      email

    });


    // Save user
    await newUser.save();


    res.status(201).json({

      message: "User registered successfully",

      user: newUser

    });


  } catch (error) {

    console.error("REGISTER ERROR:", error);

    res.status(500).json({

      message: "Server error"

    });

  }

});



// ===============================
// LOGIN USER
// ===============================

router.post("/login", async (req, res) => {

  try {

    const { consumerNumber } = req.body;


    // Check consumer number
    const user = await User.findOne({

      consumerNumber: consumerNumber

    });


    // User not found
    if (!user) {

      return res.status(404).json({

        message: "Consumer not registered. Please register first."

      });

    }


    // User found
    res.status(200).json({

      message: "Consumer found successfully",

      user: user

    });


  } catch (error) {

    console.error("LOGIN ERROR:", error);

    res.status(500).json({

      message: "Server error"

    });

  }

});


module.exports = router;
const express = require("express");
const User = require("../models/User");

const router = express.Router();


// =====================================================
// REGISTER USER
// =====================================================

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



// =====================================================
// LOGIN USER
// =====================================================

router.post("/login", async (req, res) => {

  try {

    const { consumerNumber } = req.body;


    // Find user
    const user = await User.findOne({

      consumerNumber: consumerNumber

    });


    // User not found
    if (!user) {

      return res.status(404).json({

        message:
          "Consumer not registered. Please register first."

      });

    }


    // User found
    res.status(200).json({

      message:
        "Consumer found successfully",

      user: user

    });


  } catch (error) {

    console.error("LOGIN ERROR:", error);

    res.status(500).json({

      message: "Server error"

    });

  }

});



// =====================================================
// GET MY PROFILE
// =====================================================

router.get("/profile/:consumerNumber", async (req, res) => {

  try {

    const { consumerNumber } = req.params;


    // Find user by consumer number
    const user = await User.findOne({

      consumerNumber: consumerNumber

    });


    // User not found
    if (!user) {

      return res.status(404).json({

        message: "User profile not found"

      });

    }


    // Send user profile
    res.status(200).json({

      message: "Profile fetched successfully",

      user: user

    });


  } catch (error) {

    console.error("PROFILE FETCH ERROR:", error);

    res.status(500).json({

      message: "Server error"

    });

  }

});



// =====================================================
// UPDATE MY PROFILE
// =====================================================

router.put("/profile/:consumerNumber", async (req, res) => {

  try {

    const { consumerNumber } = req.params;

    const {
      name,
      mobile,
      email,
      address
    } = req.body;


    // Update user
    const updatedUser = await User.findOneAndUpdate(

      {
        consumerNumber: consumerNumber
      },

      {
        name: name,
        mobile: mobile,
        email: email,
        address: address
      },

      {
        new: true,
        runValidators: true
      }

    );


    // User not found
    if (!updatedUser) {

      return res.status(404).json({

        message: "User profile not found"

      });

    }


    // Success
    res.status(200).json({

      message: "Profile updated successfully",

      user: updatedUser

    });


  } catch (error) {

    console.error("PROFILE UPDATE ERROR:", error);

    res.status(500).json({

      message: "Profile update failed"

    });

  }

});


module.exports = router;
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    consumerNumber: {
      type: String,
      required: true,
      unique: true,
    },

    meterNumber: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
    },

    address: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      default: "",
    },

    connectionStatus: {
      type: String,
      default: "Active",
    },

    role: {
      type: String,
      enum: ["consumer", "admin"],
      default: "consumer",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
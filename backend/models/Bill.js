const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    consumerNumber: {
      type: String,
      required: true,
    },

    billNumber: {
      type: String,
      required: true,
      unique: true,
    },

    month: {
      type: String,
      required: true,
    },

    units: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    dueDate: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bill", billSchema);
const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    consumerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    consumerNumber: {
      type: String,
      required: true,
    },

    billNumber: {
      type: String,
      required: true,
      unique: true,
    },

    billingMonth: {
      type: String,
      required: true,
    },

    units: {
      type: Number,
      required: true,
      default: 0,
    },

    ratePerUnit: {
      type: Number,
      required: true,
      default: 6.5,
    },

    usageCharge: {
      type: Number,
      default: 0,
    },

    fixedCharge: {
      type: Number,
      default: 0,
    },

    additionalCharge: {
      type: Number,
      default: 0,
    },

    subtotal: {
      type: Number,
      default: 0,
    },

    taxRate: {
      type: Number,
      default: 5,
    },

    tax: {
      type: Number,
      default: 0,
    },

    previousDue: {
      type: Number,
      default: 0,
    },

    lateFee: {
      type: Number,
      default: 0,
    },

    credit: {
      type: Number,
      default: 0,
    },

    billAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Paid", "Pending", "Overdue"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bill", billSchema);
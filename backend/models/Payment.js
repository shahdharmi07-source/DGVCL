const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    consumerNumber: {
      type: String,
      required: true
    },

    billNumber: {
      type: String,
      required: true
    },

    billMonth: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      required: true
    },

    transactionId: {
      type: String,
      required: true,
      unique: true
    },

    paymentDate: {
      type: Date,
      default: Date.now
    },

    status: {
      type: String,
      default: "Success"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
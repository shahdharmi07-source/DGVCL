const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      required: true,
    },

    consumer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    consumerNumber: {
      type: String,
      required: false,
    },

    category: {
      type: String,
      default: "General Electricity Issue",
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },

    adminRemark: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Complaint",
  complaintSchema
);
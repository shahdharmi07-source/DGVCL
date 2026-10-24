const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    consumerNumber: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "Bill Due",
        "Payment",
        "Power Outage",
        "Complaint",
        "Maintenance",
        "Usage",
        "Important",
        "General",
      ],
      default: "General",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    read: {
      type: Boolean,
      default: false,
    },

    actionText: {
      type: String,
      default: "",
    },

    actionLink: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);
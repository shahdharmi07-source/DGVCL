const express = require("express");
const Notification = require("../models/Notification");

const router = express.Router();


// ==================================================
// GET NOTIFICATIONS FOR A CONSUMER
// ==================================================

router.get("/:consumerNumber", async (req, res) => {
  try {
    const { consumerNumber } = req.params;

    const notifications = await Notification.find({
      consumerNumber: consumerNumber,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      notifications: notifications,
    });
  } catch (error) {
    console.error(
      "Get Notification Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch notifications",
      notifications: [],
    });
  }
});


// ==================================================
// CREATE NOTIFICATION
// ==================================================

router.post("/create", async (req, res) => {
  try {
    const {
      consumerNumber,
      title,
      message,
      type,
      priority,
      actionText,
      actionLink,
    } = req.body;

    if (
      !consumerNumber ||
      !title ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Consumer number, title and message are required",
      });
    }

    const notification =
      new Notification({
        consumerNumber: consumerNumber,
        title: title,
        message: message,
        type: type || "General",
        priority: priority || "medium",
        actionText: actionText || "",
        actionLink: actionLink || "",
        read: false,
      });

    await notification.save();

    res.status(201).json({
      success: true,
      message:
        "Notification created successfully",
      notification: notification,
    });
  } catch (error) {
    console.error(
      "Create Notification Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to create notification",
    });
  }
});


// ==================================================
// MARK SINGLE NOTIFICATION AS READ
// ==================================================

router.put("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;

    const notification =
      await Notification.findByIdAndUpdate(
        id,
        {
          read: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Notification marked as read",
      notification: notification,
    });
  } catch (error) {
    console.error(
      "Mark Notification Read Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to mark notification as read",
    });
  }
});


// ==================================================
// MARK ALL NOTIFICATIONS AS READ
// ==================================================

router.put(
  "/read-all/:consumerNumber",
  async (req, res) => {
    try {
      const { consumerNumber } = req.params;

      await Notification.updateMany(
        {
          consumerNumber: consumerNumber,
          read: false,
        },
        {
          $set: {
            read: true,
          },
        }
      );

      res.status(200).json({
        success: true,
        message:
          "All notifications marked as read",
      });
    } catch (error) {
      console.error(
        "Mark All Notifications Read Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to mark all notifications as read",
      });
    }
  }
);


module.exports = router;
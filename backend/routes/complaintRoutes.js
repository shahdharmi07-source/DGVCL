const express = require("express");
const router = express.Router();

const Complaint = require("../models/Complaint");

// =====================================================
// CREATE COMPLAINT
// =====================================================

router.post("/", async (req, res) => {
  try {
    const {
      consumerNumber,
      category,
      description,
    } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Complaint description is required.",
      });
    }

    const complaintId =
      "DGPS-" +
      Math.floor(100000 + Math.random() * 900000);

    const complaint = new Complaint({
      complaintId,
      consumerNumber: consumerNumber || "",
      category:
        category || "General Electricity Issue",
      description: description.trim(),
      status: "Pending",
      adminRemark: "",
    });

    await complaint.save();

    res.status(201).json({
      success: true,
      message: "Complaint registered successfully.",
      complaint,
    });
  } catch (error) {
    console.error("Create Complaint Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to register complaint.",
      error: error.message,
    });
  }
});

// =====================================================
// GET ALL COMPLAINTS
// =====================================================

router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error("Get Complaints Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch complaints.",
      error: error.message,
    });
  }
});

// =====================================================
// UPDATE COMPLAINT
// Admin can update status and remark
// =====================================================

router.put("/:id", async (req, res) => {
  try {
    const {
      status,
      adminRemark,
    } = req.body;

    const allowedStatus = [
      "Pending",
      "In Progress",
      "Resolved",
    ];

    if (
      status &&
      !allowedStatus.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status.",
      });
    }

    const complaint =
      await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    if (status) {
      complaint.status = status;
    }

    if (adminRemark !== undefined) {
      complaint.adminRemark = adminRemark;
    }

    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully.",
      complaint,
    });
  } catch (error) {
    console.error("Update Complaint Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update complaint.",
      error: error.message,
    });
  }
});

// =====================================================
// DELETE COMPLAINT
// =====================================================

router.delete("/:id", async (req, res) => {
  try {
    const complaint =
      await Complaint.findByIdAndDelete(
        req.params.id
      );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Complaint Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete complaint.",
      error: error.message,
    });
  }
});

module.exports = router;
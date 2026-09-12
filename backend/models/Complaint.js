const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    studentUID: {
      type: String,
      required: true,
    },

    studentName: {
      type: String,
    },

    busId: {
      type: String,
    },

    type: {
      type: String,
      enum: ["emergency", "complaint", "driver_behavior", "other"],
      default: "other",
    },

    message: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["open", "reviewed", "resolved"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);
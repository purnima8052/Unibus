const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    busId: {
      type: String,
      required: true,
    },

    createdByRole: {
      type: String,
      enum: ["driver", "coordinator"],
    },

    type: {
      type: String,
      enum: ["traffic", "accident", "delay", "other"],
      default: "other",
    },

    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Alert", alertSchema);
const mongoose = require("mongoose");

const boardingSchema = new mongoose.Schema(
  {
    studentUID: {
      type: String,
      required: true,
    },

    busId: {
      type: String,
      required: true,
    },

    studentLocation: {
      lat: Number,
      lng: Number,
    },

    distanceFromBus: {
      type: Number,
    },

    status: {
      type: String,
      enum: ["onboard", "not_onboard", "unverified"],
      default: "unverified",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BoardingStatus", boardingSchema);
const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    busId: {
      type: String,
      required: true,
      unique: true,
    },

    busNumber: {
      type: String,
      required: true,
    },

    capacity: {
      type: Number,
      default: 40,
    },

    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },

    coordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    currentLocation: {
      lat: {
        type: Number,
        default: null,
      },

      lng: {
        type: Number,
        default: null,
      },

      updatedAt: {
        type: Date,
        default: null,
      },
    },

    status: {
      type: String,
      enum: ["active", "idle", "maintenance"],
      default: "idle",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bus", busSchema);
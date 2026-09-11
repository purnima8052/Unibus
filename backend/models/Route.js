const mongoose = require("mongoose");

const stopSchema = new mongoose.Schema({
  name: String,
  lat: Number,
  lng: Number,
  order: Number,
});

const routeSchema = new mongoose.Schema(
  {
    routeName: {
      type: String,
      required: true,
    },

    routeCode: {
      type: String,
      required: true,
      unique: true,
    },

    stops: [stopSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Route", routeSchema);
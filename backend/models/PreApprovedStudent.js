const mongoose = require("mongoose");

const preApprovedSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },

    name: String,

    course: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PreApprovedStudent",
  preApprovedSchema
);
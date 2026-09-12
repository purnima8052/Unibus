const Bus = require("../models/Bus");

// Admin: create bus
exports.createBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);

    res.status(201).json(bus);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Admin: update bus assignment
exports.updateBus = async (req, res) => {
  const bus =
    await Bus.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

  res.json(bus);
};

// Student: search bus
exports.searchBus = async (req, res) => {
  const { query } = req.query;

  const buses = await Bus.find({
    $or: [
      {
        busId: {
          $regex: query,
          $options: "i",
        },
      },
      {
        busNumber: {
          $regex: query,
          $options: "i",
        },
      },
    ],
  }).populate("route driver");

  res.json(buses);
};

// Get all buses
exports.getAllBuses = async (req, res) => {
  const buses =
    await Bus.find()
      .populate(
        "route driver coordinator"
      );

  res.json(buses);
};

// Get one bus
exports.getBusById = async (req, res) => {
  const bus =
    await Bus.findById(req.params.id)
      .populate(
        "route driver coordinator"
      );

  res.json(bus);
};
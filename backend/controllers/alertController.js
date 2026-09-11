const Alert = require("../models/Alert");

exports.createAlert = async (
  req,
  res,
  io
) => {
  try {
    const {
      busId,
      type,
      message,
    } = req.body;

    const alert =
      await Alert.create({
        busId,
        type,
        message,
        createdByRole: req.user.role,
      });

    // Broadcast live alert
    io.to(`bus_${busId}`)
      .emit("newAlert", alert);

    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getAlertsForBus =
  async (req, res) => {
    const alerts =
      await Alert.find({
        busId: req.params.busId,
      }).sort({
        createdAt: -1,
      });

    res.json(alerts);
  };
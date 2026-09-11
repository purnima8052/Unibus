const Bus = require("../models/Bus");
const BoardingStatus =
  require("../models/BoardingStatus");

const getDistanceInMeters =
  require("../utils/distance");

const THRESHOLD_METERS = 50;

exports.checkIn = async (req, res) => {
  try {
    const {
      busId,
      lat,
      lng,
      manualStatus,
    } = req.body;

    const studentUID =
      req.user.uid;

    // Student says NOT onboard
    if (
      manualStatus === "not_onboard"
    ) {
      const record =
        await BoardingStatus.create({
          studentUID,
          busId,
          status: "not_onboard",
        });

      return res.json(record);
    }

    const bus =
      await Bus.findOne({ busId });

    if (
      !bus ||
      !bus.currentLocation.lat
    ) {
      return res.status(400).json({
        message:
          "Bus location not available yet",
      });
    }

    const distance =
      getDistanceInMeters(
        lat,
        lng,
        bus.currentLocation.lat,
        bus.currentLocation.lng
      );

    const status =
      distance <= THRESHOLD_METERS
        ? "onboard"
        : "unverified";

    const record =
      await BoardingStatus.create({
        studentUID,
        busId,

        studentLocation: {
          lat,
          lng,
        },

        distanceFromBus: distance,
        status,
      });

    res.json(record);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
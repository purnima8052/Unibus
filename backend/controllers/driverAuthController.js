const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Driver = require("../models/Driver");

exports.driverLogin = async (req, res) => {
  try {
    const {
      busId,
      password,
    } = req.body;

    const driver = await Driver.findOne({ busId });

    if (!driver) {
      return res.status(404).json({
        message: "Invalid Bus ID",
      });
    }

    const match = await bcrypt.compare(
      password,
      driver.password
    );

    if (!match) {
      return res.status(401).json({
        message: "Wrong password",
      });
    }

    const token = jwt.sign(
      {
        id: driver._id,
        role: "driver",
        busId: driver.busId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,

      driver: {
        name: driver.name,
        busId: driver.busId,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
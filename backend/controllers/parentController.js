const bcrypt = require("bcryptjs");

const Parent = require("../models/Parent");
const User = require("../models/User");
const Bus = require("../models/Bus");

// Student adds parent
exports.addParent = async (req, res) => {
  try {
    const {
      name,
      phone,
      password,
    } = req.body;

    const studentUID = req.user.uid;

    const count =
      await Parent.countDocuments({
        studentUID,
      });

    if (count >= 2) {
      return res.status(400).json({
        message:
          "Maximum 2 parents already added",
      });
    }

    const student =
      await User.findOne({
        uid: studentUID,
      });

    const hashed =
      await bcrypt.hash(password, 10);

    const parent =
      await Parent.create({
        name,
        phone,
        password: hashed,
        studentUID,
        studentName: student.name,
      });

    res.status(201).json(parent);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Parent login
exports.parentLogin = async (req, res) => {
  const jwt = require("jsonwebtoken");

  const {
    phone,
    password,
  } = req.body;

  const parent =
    await Parent.findOne({ phone });

  if (!parent) {
    return res.status(404).json({
      message: "Parent not found",
    });
  }

  const match =
    await bcrypt.compare(
      password,
      parent.password
    );

  if (!match) {
    return res.status(401).json({
      message: "Wrong password",
    });
  }

  const token = jwt.sign(
    {
      id: parent._id,
      role: "parent",
      studentUID: parent.studentUID,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.json({
    token,
    parent,
  });
};

// Parent views child's bus
exports.getMyChildBus = async (
  req,
  res
) => {
  const student =
    await User.findOne({
      uid: req.user.studentUID,
    });

  res.json({
    message: "Fetch bus details linked to",
    uid: req.user.studentUID,
  });
};
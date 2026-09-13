const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const PreApprovedStudent = require("../models/PreApprovedStudent");

const generateToken = (payload) =>
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

// =====================================================
// STUDENT SELF-REGISTRATION
// =====================================================

exports.registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      uid,
      course,
    } = req.body;

    const existing = await User.findOne({
      $or: [{ email }, { uid }],
    });

    if (existing) {
      return res.status(400).json({
        message: "Email or UID already registered",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Auto-approve if admin already bulk-uploaded this UID
    const preApproved =
      await PreApprovedStudent.findOne({ uid });

    const student = await User.create({
      name,
      email,
      password: hashed,
      uid,
      course,
      role: "student",
      isApproved: !!preApproved,
    });

    res.status(201).json({
      message: preApproved
        ? "Registered and auto-approved!"
        : "Registered! Waiting for admin approval.",

      isApproved: student.isApproved,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// =====================================================
// TEMPORARY - CREATE ADMIN
// =====================================================

exports.createAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    // Check whether admin/email already exists
    const existing = await User.findOne({
      email,
    });

    if (existing) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(
      password,
      10
    );

    // Create admin
    const admin = await User.create({
      name,
      email,
      password: hashed,
      role: "admin",
      isApproved: true,
    });

    res.status(201).json({
      message: "Admin created successfully",

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// =====================================================
// LOGIN — ADMIN, COORDINATOR, STUDENT
// =====================================================

exports.login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(401).json({
        message: "Wrong password",
      });
    }

    if (
      user.role === "student" &&
      !user.isApproved
    ) {
      return res.status(403).json({
        message: "Awaiting admin approval",
      });
    }

    const token = generateToken({
      id: user._id,
      role: user.role,
      uid: user.uid,
    });

    res.json({
      token,

      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        uid: user.uid,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
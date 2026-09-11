const bcrypt = require("bcryptjs");
const xlsx = require("xlsx");
const fs = require("fs");

const User = require("../models/User");
const Driver = require("../models/Driver");
const PreApprovedStudent =
  require("../models/PreApprovedStudent");

// Admin creates a driver
exports.createDriver = async (req, res) => {
  try {
    const {
      name,
      phone,
      busId,
      password,
    } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const driver = await Driver.create({
      name,
      phone,
      busId,
      password: hashed,
    });

    res.status(201).json(driver);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Admin creates coordinator
exports.createCoordinator = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const coordinator = await User.create({
      name,
      email,
      password: hashed,
      role: "coordinator",
      isApproved: true,
    });

    res.status(201).json(coordinator);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// List pending students
exports.getPendingStudents = async (req, res) => {
  const students = await User.find({
    role: "student",
    isApproved: false,
  });

  res.json(students);
};

// Approve student
exports.approveStudent = async (req, res) => {
  const student =
    await User.findByIdAndUpdate(
      req.params.id,
      {
        isApproved: true,
      },
      {
        new: true,
      }
    );

  res.json(student);
};

// BULK UPLOAD — Excel
exports.bulkUploadStudents = async (req, res) => {
  try {
    const workbook =
      xlsx.readFile(req.file.path);

    const sheetName =
      workbook.SheetNames[0];

    const rows =
      xlsx.utils.sheet_to_json(
        workbook.Sheets[sheetName]
      );

    // Expected columns:
    // uid, name, course

    let autoApproved = 0;
    let preAdded = 0;

    for (const row of rows) {
      const uid = String(row.uid).trim();

      // If student already registered
      const existingUser =
        await User.findOne({ uid });

      if (existingUser) {
        existingUser.isApproved = true;

        await existingUser.save();

        autoApproved++;
      } else {
        // Store for future auto approval
        await PreApprovedStudent.updateOne(
          { uid },
          {
            uid,
            name: row.name,
            course: row.course,
          },
          {
            upsert: true,
          }
        );

        preAdded++;
      }
    }

    fs.unlinkSync(req.file.path);

    res.json({
      message: "Bulk upload complete",
      autoApproved,
      preAdded,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const express = require("express");

const router = express.Router();

const {
  registerStudent,
  login,
  createAdmin,
} = require("../controllers/authController");


// =====================================================
// STUDENT REGISTER
// =====================================================

router.post(
  "/register",
  registerStudent
);


// =====================================================
// LOGIN
// =====================================================

router.post(
  "/login",
  login
);


// =====================================================
// TEMPORARY ADMIN CREATION
// =====================================================

router.post(
  "/create-admin",
  createAdmin
);


module.exports = router;
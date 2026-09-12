const express = require("express");

const router = express.Router();

const {
  driverLogin,
} = require("../controllers/driverAuthController");

router.post(
  "/login",
  driverLogin
);

module.exports = router;
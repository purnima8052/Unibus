const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const allowRoles =
  require("../middleware/roleMiddleware");

const {
  checkIn,
} = require("../controllers/boardingController");

router.post(
  "/check-in",
  protect,
  allowRoles("student"),
  checkIn
);

module.exports = router;
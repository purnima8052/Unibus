const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const allowRoles =
  require("../middleware/roleMiddleware");

const {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus,
} = require("../controllers/complaintController");

router.post(
  "/",
  protect,
  allowRoles("student"),
  createComplaint
);

router.get(
  "/",
  protect,
  allowRoles("admin"),
  getAllComplaints
);

router.put(
  "/:id",
  protect,
  allowRoles("admin"),
  updateComplaintStatus
);

module.exports = router;
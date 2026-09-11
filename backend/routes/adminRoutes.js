const express = require("express");
const multer = require("multer");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const allowRoles =
  require("../middleware/roleMiddleware");

const {
  createDriver,
  createCoordinator,
  getPendingStudents,
  approveStudent,
  bulkUploadStudents,
} = require("../controllers/adminController");

const upload =
  multer({
    dest: "uploads/",
  });

// Every route below requires admin
router.use(
  protect,
  allowRoles("admin")
);

router.post(
  "/drivers",
  createDriver
);

router.post(
  "/coordinators",
  createCoordinator
);

router.get(
  "/students/pending",
  getPendingStudents
);

router.put(
  "/students/:id/approve",
  approveStudent
);

router.post(
  "/students/bulk-upload",
  upload.single("file"),
  bulkUploadStudents
);

module.exports = router;
const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const allowRoles =
  require("../middleware/roleMiddleware");

const {
  createBus,
  updateBus,
  searchBus,
  getAllBuses,
  getBusById,
} = require("../controllers/busController");

// Public search
router.get(
  "/search",
  searchBus
);

// Logged-in users
router.get(
  "/",
  protect,
  getAllBuses
);

router.get(
  "/:id",
  protect,
  getBusById
);

// Admin only
router.post(
  "/",
  protect,
  allowRoles("admin"),
  createBus
);

router.put(
  "/:id",
  protect,
  allowRoles("admin"),
  updateBus
);

module.exports = router;
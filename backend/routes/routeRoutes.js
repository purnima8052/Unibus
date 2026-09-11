const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const allowRoles =
  require("../middleware/roleMiddleware");

const {
  createRoute,
  getAllRoutes,
} = require("../controllers/routeController");

router.get(
  "/",
  getAllRoutes
);

router.post(
  "/",
  protect,
  allowRoles("admin"),
  createRoute
);

module.exports = router;
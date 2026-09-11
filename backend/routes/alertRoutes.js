const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const allowRoles =
  require("../middleware/roleMiddleware");

const {
  createAlert,
  getAlertsForBus,
} = require("../controllers/alertController");

module.exports = (io) => {

  router.post(
    "/",
    protect,
    allowRoles(
      "driver",
      "coordinator"
    ),
    (req, res) =>
      createAlert(req, res, io)
  );

  router.get(
    "/:busId",
    getAlertsForBus
  );

  return router;
};
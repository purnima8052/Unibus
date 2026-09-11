const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const allowRoles =
  require("../middleware/roleMiddleware");

const {
  addParent,
  parentLogin,
  getMyChildBus,
} = require("../controllers/parentController");

router.post(
  "/login",
  parentLogin
);

router.post(
  "/",
  protect,
  allowRoles("student"),
  addParent
);

router.get(
  "/my-child-bus",
  protect,
  allowRoles("parent"),
  getMyChildBus
);

module.exports = router;
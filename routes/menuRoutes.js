const express = require("express");
const router = express.Router();
const { verifyAdmin, checkRole } = require("../middlewares/authMiddleware");

const {
  getMenu,
  updateMenu,
  incrementViews,
  updateAllowedItems,
  addMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

router.get("/:type", getMenu);
router.put(
  "/:type",
  verifyAdmin,
  checkRole(["superadmin", "admin"]),
  updateMenu,
);
router.post("/:type/item", verifyAdmin, checkRole(["superadmin"]), addMenuItem);
router.delete(
  "/:type/item/:itemId",
  verifyAdmin,
  checkRole(["superadmin"]),
  deleteMenuItem,
);
router.put(
  "/:type/allowed",
  verifyAdmin,
  checkRole(["superadmin"]),
  updateAllowedItems,
);
router.post("/:type/view", incrementViews);

module.exports = router;

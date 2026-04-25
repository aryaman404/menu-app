const express = require("express");
const router = express.Router();
const { verifyAdmin, checkRole } = require("../middlewares/authMiddleware");
const {
  getAllAdmins,
  resetPassword,
} = require("../controllers/adminController");

router.get("/all", verifyAdmin, checkRole(["superadmin"]), getAllAdmins);
router.put(
  "/reset-password/:id",
  verifyAdmin,
  checkRole(["superadmin"]),
  resetPassword,
);

module.exports = router;

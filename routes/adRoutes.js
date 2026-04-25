const express = require("express");
const router = express.Router();
const { verifyAdmin, checkRole } = require("../middlewares/authMiddleware");
const { getAdConfig, updateAdConfig } = require("../controllers/adController");

router.get("/config", getAdConfig);
router.put("/config", verifyAdmin, checkRole(["superadmin"]), updateAdConfig);

module.exports = router;

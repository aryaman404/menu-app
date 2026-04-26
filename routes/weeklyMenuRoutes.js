const express = require("express");
const router = express.Router();

const {
  getWeeklyMenu,
  updateWeeklyMenu,
  commitDailyMenu,
  resetWeeklyMenu,
} = require("../controllers/weeklyMenuController");

// Public endpoints
router.get("/", getWeeklyMenu);
router.put("/update", updateWeeklyMenu);

// Internal cron endpoints (not exposed to public)
router.post("/commit", commitDailyMenu);
router.post("/reset", resetWeeklyMenu);

module.exports = router;

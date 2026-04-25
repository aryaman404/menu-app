const express = require("express");
const router = express.Router();

const {
  getWeeklyMenu,
  updateWeeklyMenu,
} = require("../controllers/weeklyMenuController");

router.get("/", getWeeklyMenu);
router.put("/update", updateWeeklyMenu);

module.exports = router;

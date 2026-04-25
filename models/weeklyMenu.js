const mongoose = require("mongoose"); // ✅ ADD THIS FIRST

const weeklyMenuSchema = new mongoose.Schema({
  weekStart: String,

  data: [
    {
      day: String,
      breakfast: String,
      lunch: String,
      dinner: String,
    },
  ],
});

module.exports = mongoose.model("WeeklyMenu", weeklyMenuSchema);

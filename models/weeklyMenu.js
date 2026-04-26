const mongoose = require("mongoose");

const weeklyMenuSchema = new mongoose.Schema({
  weekStart: String,

  data: [
    {
      day: String,
      // Visible fields (only updated after commit)
      breakfast: { type: String, default: "" },
      lunch: { type: String, default: "" },
      dinner: { type: String, default: "" },
      // Hidden pending fields (visible after 11:45 PM commit)
      pending: {
        breakfast: { type: String, default: "" },
        lunch: { type: String, default: "" },
        dinner: { type: String, default: "" },
      },
      // Track when data was last committed
      lastCommittedAt: { type: Date, default: null },
    },
  ],
});

module.exports = mongoose.model("WeeklyMenu", weeklyMenuSchema);

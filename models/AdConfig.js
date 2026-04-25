const mongoose = require("mongoose");

const adConfigSchema = new mongoose.Schema({
  enabled: {
    type: Boolean,
    default: false,
  },
  script: {
    type: String,
    default: "",
  },
  position: {
    betweenBreakfastLunch: {
      type: Boolean,
      default: true,
    },
    betweenLunchDinner: {
      type: Boolean,
      default: true,
    },
    bottomPage: {
      type: Boolean,
      default: true,
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AdConfig", adConfigSchema);

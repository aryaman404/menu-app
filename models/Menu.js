const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    default: "",
  },
});

const menuSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true,
    enum: ["breakfast", "lunch", "dinner"],
  },

  // ✅ SELECTED ITEMS (shown on UI)
  items: {
    type: [menuItemSchema],
    default: [],
  },

  // ✅ AVAILABLE ITEMS (WITH IMAGES 🔥)
  allowedItems: {
    type: [menuItemSchema], // ✅ FIXED
    default: [],
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },

  views: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Menu", menuSchema);

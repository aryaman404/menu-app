const mongoose = require("mongoose");
require("dotenv").config();

const Menu = require("./models/Menu");

const createAllowedItems = (items) => {
  return items.map((item) => ({
    name: item.name,
    imageUrl: item.imageUrl,
  }));
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("📦 Connected to MongoDB");

    await Menu.deleteMany();

    // ---------------- BREAKFAST ----------------
    const breakfastItems = [
      {
        name: "Poha",
        imageUrl:
          "https://res.cloudinary.com/dutlaq6we/image/upload/q_auto/f_auto/v1776634688/poha_whq4oq.jpg",
      },
      {
        name: "Upma",
        imageUrl:
          "https://res.cloudinary.com/dutlaq6we/image/upload/q_auto/f_auto/v1776634650/Vegetable-upma_vwjxuu.jpg",
      },
      {
        name: "Misal Pav",
        imageUrl:
          "https://res.cloudinary.com/dutlaq6we/image/upload/q_auto/f_auto/v1776634713/Misal-Pav-2-2-e1722869218662-1200x1200_jpdqur.jpg",
      },
      {
        name: "Idli",
        imageUrl:
          "https://res.cloudinary.com/dutlaq6we/image/upload/q_auto/f_auto/v1776634550/53239358_a4m5ew.jpg",
      },
      {
        name: "Dosa",
        imageUrl:
          "https://res.cloudinary.com/dutlaq6we/image/upload/q_auto/f_auto/v1776634734/Crispy-Plain-Dosa-Recipe-1_ja6vim.jpg",
      },
    ];

    // ---------------- LUNCH ----------------
    const lunchItems = [
      {
        name: "Dal",
        imageUrl:
          "https://res.cloudinary.com/dutlaq6we/image/upload/q_auto/f_auto/v1776635433/hyderabadi-daal-featured_tix4ac.jpg",
      },
      {
        name: "Chawal",
        imageUrl:
          "https://res.cloudinary.com/dutlaq6we/image/upload/q_auto/f_auto/v1776635486/perfect-Jasmine-rice-recipe-2_sxevyo.jpg",
      },
      {
        name: "Roti",
        imageUrl:
          "https://res.cloudinary.com/dutlaq6we/image/upload/q_auto/f_auto/v1776635532/Dosa-bhaji_-close_vjes8m.jpg",
      },
    ];

    // ---------------- DINNER ----------------
    const dinnerItems = [
      {
        name: "Roti",
        imageUrl:
          "https://res.cloudinary.com/dutlaq6we/image/upload/q_auto/f_auto/v1776635510/Plain-Roti-Tandoori-or-Tawa_ofxe71.jpg",
      },
      {
        name: "Chawal",
        imageUrl:
          "https://res.cloudinary.com/dutlaq6we/image/upload/q_auto/f_auto/v1776635486/perfect-Jasmine-rice-recipe-2_sxevyo.jpg",
      },
      {
        name: "Paneer",
        imageUrl:
          "https://res.cloudinary.com/dutlaq6we/image/upload/q_auto/f_auto/v1776636013/IMG-4885_81a9b5f6-19fd-4f31-ac67-b5fc75926eb1_2000x_ozmsuk.jpg",
      },
    ];

    await Menu.insertMany([
      {
        type: "breakfast",
        items: breakfastItems,
        allowedItems: createAllowedItems(breakfastItems),
      },
      {
        type: "lunch",
        items: lunchItems,
        allowedItems: createAllowedItems(lunchItems),
      },
      {
        type: "dinner",
        items: dinnerItems,
        allowedItems: createAllowedItems(dinnerItems),
      },
    ]);

    console.log("✅ Menu seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding:", err);
    process.exit(1);
  }
};

seedData();

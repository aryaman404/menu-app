const Menu = require("../models/Menu");
const WeeklyMenu = require("../models/weeklyMenu");

// 🔥 helper: get Monday of current week
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();

  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));

  monday.setHours(0, 0, 0, 0);
  return monday;
}

// GET MENU
exports.getMenu = async (req, res) => {
  try {
    const menu = await Menu.findOne({ type: req.params.type });

    if (!menu) {
      return res.json({
        type: req.params.type,
        items: [],
        allowedItems: [],
        views: 0,
        updatedAt: null,
      });
    }

    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔥 UPDATE MENU (DAILY ONLY - WEEKLY TABLE UPDATED AT 11:45 PM)
exports.updateMenu = async (req, res) => {
  try {
    const { items } = req.body;
    const type = req.params.type;

    // 1️⃣ UPDATE DAILY MENU IMMEDIATELY (visible in Breakfast/Lunch/Dinner sections)
    const menu = await Menu.findOneAndUpdate(
      { type },
      {
        items: items || [],
        updatedAt: new Date(),
      },
      { new: true, upsert: true },
    );

    // 2️⃣ SAVE TO WEEKLY MENU PENDING FIELDS (committed at 11:45 PM)
    const weekStart = getMonday(new Date());
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

    let weekly = await WeeklyMenu.findOne({ weekStart });

    // create week if not exists
    if (!weekly) {
      weekly = new WeeklyMenu({
        weekStart,
        data: [
          { day: "Monday", breakfast: "", lunch: "", dinner: "", pending: { breakfast: "", lunch: "", dinner: "" }, lastCommittedAt: null },
          { day: "Tuesday", breakfast: "", lunch: "", dinner: "", pending: { breakfast: "", lunch: "", dinner: "" }, lastCommittedAt: null },
          { day: "Wednesday", breakfast: "", lunch: "", dinner: "", pending: { breakfast: "", lunch: "", dinner: "" }, lastCommittedAt: null },
          { day: "Thursday", breakfast: "", lunch: "", dinner: "", pending: { breakfast: "", lunch: "", dinner: "" }, lastCommittedAt: null },
          { day: "Friday", breakfast: "", lunch: "", dinner: "", pending: { breakfast: "", lunch: "", dinner: "" }, lastCommittedAt: null },
          { day: "Saturday", breakfast: "", lunch: "", dinner: "", pending: { breakfast: "", lunch: "", dinner: "" }, lastCommittedAt: null },
          { day: "Sunday", breakfast: "", lunch: "", dinner: "", pending: { breakfast: "", lunch: "", dinner: "" }, lastCommittedAt: null },
        ],
      });
    }

    // convert items → string
    const value = items.map((i) => i.name).join(", ");

    // find day entry
    let dayEntry = weekly.data.find((d) => d.day === today);

    if (!dayEntry) {
      // create day if missing - use nested PENDING fields
      const newDay = {
        day: today,
        breakfast: "",
        lunch: "",
        dinner: "",
        pending: {
          breakfast: type === "breakfast" ? value : "",
          lunch: type === "lunch" ? value : "",
          dinner: type === "dinner" ? value : "",
        },
        lastCommittedAt: null,
      };
      weekly.data.push(newDay);
    } else {
      // Save to nested PENDING field (not visible until 11:45 PM commit)
      if (!dayEntry.pending) {
        dayEntry.pending = { breakfast: "", lunch: "", dinner: "" };
      }
      dayEntry.pending[type] = value;
    }

    await weekly.save();

    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SUPERADMIN: ADD ITEM TO ALLOWED LIST
exports.addMenuItem = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;
    const type = req.params.type;

    if (!name) {
      return res.status(400).json({ message: "Item name is required" });
    }

    let menu = await Menu.findOne({ type });

    if (!menu) {
      menu = new Menu({ type, allowedItems: [] });
    }

    const exists = menu.allowedItems.some(
      (item) => item.name.toLowerCase() === name.trim().toLowerCase(),
    );

    if (exists) {
      return res.status(400).json({ message: "Item already exists" });
    }

    menu.allowedItems.push({
      name: name.trim(),
      imageUrl: imageUrl?.trim() || "",
    });

    await menu.save();

    res.status(201).json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SUPERADMIN: DELETE ITEM FROM ALLOWED LIST
exports.deleteMenuItem = async (req, res) => {
  try {
    const { type, itemId } = req.params;
    const menu = await Menu.findOne({ type });

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    const index = menu.allowedItems.findIndex(
      (item) =>
        item._id.toString() === itemId || item.id?.toString() === itemId,
    );

    if (index === -1) {
      return res.status(404).json({ message: "Allowed item not found" });
    }

    menu.allowedItems.splice(index, 1);
    await menu.save();

    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE ALLOWED ITEMS
exports.updateAllowedItems = async (req, res) => {
  try {
    const { allowedItems } = req.body;

    const menu = await Menu.findOneAndUpdate(
      { type: req.params.type },
      {
        allowedItems: allowedItems || [],
      },
      { new: true, upsert: true },
    );

    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// INCREMENT VIEWS
exports.incrementViews = async (req, res) => {
  try {
    await Menu.findOneAndUpdate(
      { type: req.params.type },
      { $inc: { views: 1 } },
      { upsert: true },
    );

    res.json({ message: "View counted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

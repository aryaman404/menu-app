const WeeklyMenu = require("../models/weeklyMenu");

// 🔥 get Monday (stable date object)
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday

  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));

  monday.setHours(0, 0, 0, 0); // normalize time
  return monday;
}

// 📅 GET WEEKLY MENU (AUTO CREATE IF NOT EXISTS)
exports.getWeeklyMenu = async (req, res) => {
  try {
    const weekStart = getMonday(new Date());

    let week = await WeeklyMenu.findOne({ weekStart });

    if (!week) {
      week = await WeeklyMenu.create({
        weekStart,
        data: [
          { day: "Monday", breakfast: "", lunch: "", dinner: "" },
          { day: "Tuesday", breakfast: "", lunch: "", dinner: "" },
          { day: "Wednesday", breakfast: "", lunch: "", dinner: "" },
          { day: "Thursday", breakfast: "", lunch: "", dinner: "" },
          { day: "Friday", breakfast: "", lunch: "", dinner: "" },
          { day: "Saturday", breakfast: "", lunch: "", dinner: "" },
          { day: "Sunday", breakfast: "", lunch: "", dinner: "" },
        ],
      });
    }

    res.json(week);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ UPDATE WEEKLY MENU (OPTIONAL ADMIN MANUAL EDIT)
exports.updateWeeklyMenu = async (req, res) => {
  try {
    const { day, type, value } = req.body;

    const weekStart = getMonday(new Date());

    const week = await WeeklyMenu.findOne({ weekStart });

    if (!week) {
      return res.status(404).json({ message: "Week not found" });
    }

    const index = week.data.findIndex((d) => d.day === day);

    if (index === -1) {
      return res.status(400).json({ message: "Invalid day" });
    }

    week.data[index][type] = value;
    week.data[index].updatedAt = new Date();

    await week.save();

    res.json(week);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

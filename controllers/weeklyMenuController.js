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
// Returns ONLY committed data to UI (pending updates hidden)
exports.getWeeklyMenu = async (req, res) => {
  try {
    const weekStart = getMonday(new Date());

    let week = await WeeklyMenu.findOne({ weekStart });

    if (!week) {
      week = await WeeklyMenu.create({
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

    // Only return committed data - pending updates hidden until 11:45 PM
    const sanitizedData = week.data.map((day) => ({
      day: day.day,
      breakfast: day.breakfast || "",
      lunch: day.lunch || "",
      dinner: day.dinner || "",
      lastCommittedAt: day.lastCommittedAt,
    }));

    res.json({
      weekStart: week.weekStart,
      data: sanitizedData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ UPDATE WEEKLY MENU (SAVES TO PENDING - NOT VISIBLE UNTIL 11:45 PM)
exports.updateWeeklyMenu = async (req, res) => {
  try {
    const { day, type, value } = req.body;

    const weekStart = getMonday(new Date());

    let week = await WeeklyMenu.findOne({ weekStart });

    // Create week if not exists
    if (!week) {
      week = new WeeklyMenu({
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

    const index = week.data.findIndex((d) => d.day === day);

    if (index === -1) {
      return res.status(400).json({ message: "Invalid day" });
    }

    // Save to pending nested field (not visible to UI until committed)
    week.data[index].pending[type] = value;

    await week.save();

    res.json({
      message: "Menu updated. Will be visible after 11:45 PM commit.",
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 COMMIT PENDING UPDATES (CALLED BY CRON AT 11:45 PM)
exports.commitDailyMenu = async () => {
  try {
    const weekStart = getMonday(new Date());
    const week = await WeeklyMenu.findOne({ weekStart });

    if (!week) {
      console.log("No weekly menu found to commit");
      return;
    }

    // Commit all pending updates to visible fields
    let committedCount = 0;

    for (let i = 0; i < week.data.length; i++) {
      const day = week.data[i];

      // Transfer pending → committed
      if (day.pending?.breakfast) {
        day.breakfast = day.pending.breakfast;
        day.pending.breakfast = "";
        committedCount++;
      }
      if (day.pending?.lunch) {
        day.lunch = day.pending.lunch;
        day.pending.lunch = "";
        committedCount++;
      }
      if (day.pending?.dinner) {
        day.dinner = day.pending.dinner;
        day.pending.dinner = "";
        committedCount++;
      }

      // Update commit timestamp
      day.lastCommittedAt = new Date();
    }

    await week.save();
    console.log(`✅ Daily menu committed at 11:45 PM - ${committedCount} items`);
  } catch (err) {
    console.error("Error committing daily menu:", err.message);
  }
};

// 🗑️ RESET WEEKLY MENU (CALLED EVERY MONDAY)
exports.resetWeeklyMenu = async () => {
  try {
    const weekStart = getMonday(new Date());

    // Delete old weeks
    await WeeklyMenu.deleteMany({ weekStart: { $ne: weekStart } });

    // Create new fresh week
    await WeeklyMenu.create({
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

    console.log("✅ Weekly menu reset for new week");
  } catch (err) {
    console.error("Error resetting weekly menu:", err.message);
  }
};

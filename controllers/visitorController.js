const Visitor = require("../models/Visitor");

exports.getVisitorCount = async (req, res) => {
  try {
    let visitor = await Visitor.findOne();

    const now = new Date();
    const today = now.toDateString();

    // 🆕 First time (no record in DB)
    if (!visitor) {
      visitor = await Visitor.create({
        total: 1,
        today: 1,
        lastUpdated: now,
      });
    } else {
      // 🔥 ONLY increment if new user
      if (req.query.new === "true") {
        const last = new Date(visitor.lastUpdated).toDateString();

        visitor.total += 1;

        // 📅 Handle today count
        if (last === today) {
          visitor.today += 1;
        } else {
          visitor.today = 1;
        }

        visitor.lastUpdated = now;
        await visitor.save();
      }
    }

    res.json({
      total: visitor.total,
      today: visitor.today,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

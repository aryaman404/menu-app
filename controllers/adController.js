const AdConfig = require("../models/AdConfig");

exports.getAdConfig = async (req, res) => {
  try {
    let config = await AdConfig.findOne();
    if (!config) {
      config = await AdConfig.create({});
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAdConfig = async (req, res) => {
  try {
    const { enabled, script, position } = req.body;

    const config = await AdConfig.findOneAndUpdate(
      {},
      {
        enabled: enabled !== undefined ? enabled : false,
        script: script || "",
        position: position || {
          betweenBreakfastLunch: true,
          betweenLunchDinner: true,
          bottomPage: true,
        },
        updatedAt: new Date(),
      },
      { new: true, upsert: true },
    );

    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

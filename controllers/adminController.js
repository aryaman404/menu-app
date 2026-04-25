const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, "email role createdAt");
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { id } = req.params;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

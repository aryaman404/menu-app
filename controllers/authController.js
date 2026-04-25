const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const role = admin.role || "admin";
    const token = jwt.sign({ id: admin._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

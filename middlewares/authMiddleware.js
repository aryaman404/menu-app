const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const verifyAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const admin = await Admin.findById(decoded.id).select("role");
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    req.admin = { id: admin._id, role: admin.role || decoded.role || "admin" };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const checkRole = (allowedRoles) => (req, res, next) => {
  if (!req.admin || !allowedRoles.includes(req.admin.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

module.exports = { verifyAdmin, checkRole };

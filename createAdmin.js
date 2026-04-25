const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ✅");

    const email = "superadmin@example.com";
    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log("Superadmin already exists:", email);
      process.exit(0);
    }

    const password =
      process.env.ADMIN_PASSWORD || "change_this_password_immediately";
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      email,
      password: hashedPassword,
      role: "superadmin",
    });

    await admin.save();
    console.log("Superadmin created ✅");
    console.log("Email:", email);
    console.log("Password: [HIDDEN - Set via ADMIN_PASSWORD env var]");
    console.log("⚠️  IMPORTANT: Change the default password immediately!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createSuperAdmin();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();
const visitorRoutes = require("./routes/visitorRoutes");
const weeklyMenuRoutes = require("./routes/weeklyMenuRoutes");

// Rate limiting - 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// routes
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/ads", require("./routes/adRoutes"));
app.use("/api/visitors", visitorRoutes);
app.use("/api/weekly-menu", weeklyMenuRoutes);
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

module.exports = app;

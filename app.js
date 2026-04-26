const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const helmet = require("helmet");

const app = express();
const visitorRoutes = require("./routes/visitorRoutes");
const weeklyMenuRoutes = require("./routes/weeklyMenuRoutes");

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for simplicity
  crossOriginEmbedderPolicy: false
}));

// Compression
app.use(compression());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://delicate-bunny-76fc4e.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// Rate limiting - increased for production/low-traffic use
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200, // allow more requests per minute
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(express.json({ limit: '10mb' })); // Limit payload size

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

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

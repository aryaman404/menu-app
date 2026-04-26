require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const cron = require("node-cron");
const { commitDailyMenu, resetWeeklyMenu } = require("./controllers/weeklyMenuController");

connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server running on port ${PORT}`);
  }
});

// ============================================
// 📅 CRON JOBS FOR WEEKLY MENU SYSTEM
// ============================================

// 🕚 DAILY COMMIT AT 11:45 PM
// Commits all pending menu updates to visible state
cron.schedule("45 23 * * *", async () => {
  console.log("⏰ Running daily menu commit at 11:45 PM...");
  await commitDailyMenu();
});

// 🗓️ WEEKLY RESET EVERY MONDAY AT MIDNIGHT
// Resets weekly menu for new week
cron.schedule("0 0 * * 1", async () => {
  const today = new Date().getDay(); // 0 = Sunday
  if (today === 1) { // Only run on Monday
    console.log("🗓️ Running weekly menu reset (Monday)...");
    await resetWeeklyMenu();
  }
});

console.log("✅ Cron jobs scheduled: Daily commit (11:45 PM), Weekly reset (Monday midnight)");

// Graceful shutdown for Render free tier
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

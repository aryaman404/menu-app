const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Optimized for free tier
      maxPoolSize: 5, // Limit connection pool
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    if (process.env.NODE_ENV !== 'production') {
      console.log("MongoDB Connected ✅");
      console.log("Connected DB:", mongoose.connection.name);
    }
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

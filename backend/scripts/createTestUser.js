// scripts/createTestUser.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/cortex"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import User model
const User = require("../models/user");

async function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({ email: "testuser@gmail.com" });

    if (existingUser) {
      console.log("Test user already exists!");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create test user
    const testUser = new User({
      name: "Test User",
      email: "testuser@gmail.com",
      password: hashedPassword,
    });

    await testUser.save();
    console.log("Test user created successfully!");
    
    console.log("Email: testuser@gmail.com");
    console.log("Password: password123");
  } catch (error) {
    console.error("Error creating test user:", error);
  } finally {
    mongoose.disconnect();
  }
}

createTestUser();

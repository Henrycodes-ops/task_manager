// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session"); // Added missing import
const passport = require("passport"); // Ensure passport is imported

// Configure environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Initialize passport configuration
require("./config/passport");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/cortex")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define the port number for the server to listen on
const port = process.env.PORT || 3001;

// Add middleware
app.use(express.json());
app.use(cookieParser());

// Add CORS middleware with credentials support
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://dev.example.com:5173",
      "https://accounts.google.com",
      "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Import route files
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes"); // Added missing import

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

app.use(express.urlencoded({ extended: true }));

// Basic status route for connection testing
app.get("/api/status", (req, res) => {
  res.json({ status: "Server is running" });
});

// Debug route to check Google OAuth configuration
app.get("/api/debug/config", (req, res) => {
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    environment: process.env.NODE_ENV,
    corsOrigins: [
      "http://localhost:5173",
      "http://dev.example.com:5173",
      "https://accounts.google.com",
      "http://localhost:3001",
    ],
  });
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

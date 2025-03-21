// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");

// Configure environment variables
dotenv.config();


// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/cortex"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define the port number for the server to listen on
const port = process.env.PORT || 3001;

// Add middleware
app.use(express.json());

// Add CORS middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://your-frontend-domain.com"
        : "http://localhost:5173", // Your Vite dev server port
    credentials: true,
  })
);

// Import route files
const authRoutes = require("./routes/authRoutes");

// Mount API routes
app.use("/api/auth", authRoutes);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

// Basic status route
app.get("/api/status", (req, res) => {
  res.json({ status: "Server is running" });
});

// Catch-all handler for the root and other frontend routes
app.get("*", (req, res) => {
  res.send(`
  hi
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

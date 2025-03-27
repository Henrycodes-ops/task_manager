// backend/routes/index.js
const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const githubAuthRoutes = require("./routes/authRoutes");
const { auth } = require("google-auth-library");

// Mount routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/api/auth/github", githubAuthRoutes);

module.exports = router;

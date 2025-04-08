// backend/routes/index.js
const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const taskRoutes = require("./taskRoutes");
const githubRoutes = require("./githubRoutes");

// Mount routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/github", githubRoutes);

module.exports = router;

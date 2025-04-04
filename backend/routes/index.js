// backend/routes/index.js
const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const { auth } = require("google-auth-library");

// Mount routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);


module.exports = router;

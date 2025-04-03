// authRoutes.js
const express = require("express");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user"); // Make sure this path is correct
const authController = require('../controllers/authController');
console.log("User model loaded:", !!User);

router.use((req, res, next) => {
  console.log(`Auth route accessed: ${req.method} ${req.path}`);
  console.log("Request body:", req.body);
  next();
});

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || "your-secure-jwt-secret"; // Fixed the circular reference
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Google OAuth authentication
router.post("/google", authController.googleLogin);

// GitHub OAuth authentication
router.post("/github", authController.githubLogin);

// Email/password signup
router.post("/signup", authController.signup);

// Email/password login
router.post("/login", authController.login);

// New password reset routes
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Helper function to find or create GitHub user
async function findOrCreateGitHubUser(userData) {
  try {
    // Check if user exists by githubId
    let user = await User.findOne({ githubId: userData.githubId });

    // If not found by githubId, try email
    if (!user) {
      user = await User.findOne({ email: userData.email });
    }

    // If still not found, create new user
    if (!user) {
      user = new User({
        name: userData.name,
        email: userData.email,
        githubId: userData.githubId,
        picture: userData.picture,
      });
      await user.save();
    } else {
      // Update existing user's GitHub info if needed
      if (userData.githubId && !user.githubId) {
        user.githubId = userData.githubId;
        user.picture = userData.picture || user.picture;
        await user.save();
      }
    }

    return user;
  } catch (error) {
    console.error("Error in findOrCreateGitHubUser:", error);
    throw error;
  }
}

// Helper functions with MongoDB implementations
async function findOrCreateUser(userData) {
  try {
    // Check if user exists by googleId
    let user = await User.findOne({ googleId: userData.googleId });

    // If not found by googleId, try email
    if (!user) {
      user = await User.findOne({ email: userData.email });
    }

    // If still not found, create new user
    if (!user) {
      user = new User({
        name: userData.name,
        email: userData.email,
        googleId: userData.googleId,
        picture: userData.picture,
      });
      await user.save();
    } else {
      // Update existing user's Google info if needed
      if (userData.googleId && !user.googleId) {
        user.googleId = userData.googleId;
        user.picture = userData.picture || user.picture;
        await user.save();
      }
    }

    return user;
  } catch (error) {
    console.error("Error in findOrCreateUser:", error);
    throw error;
  }
}

async function findUserByEmail(email) {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error("Error in findUserByEmail:", error);
    throw error;
  }
}

async function createUser(userData) {
  try {
    const user = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    await user.save();
    return user;
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error;
  }
}

module.exports = router;

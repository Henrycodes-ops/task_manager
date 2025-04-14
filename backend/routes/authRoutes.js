// authRoutes.js
const express = require("express");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require('passport');
const router = express.Router();
const User = require("../models/user"); // Make sure this path is correct
const authController = require('../controllers/authController');
const { generateToken } = require('../utils/auth');
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

// Google OAuth routes
router.post('/google', authController.verifyGoogleToken);
router.get('/google/callback', authController.googleCallback);

// GitHub OAuth authentication
router.post("/github", authController.githubLogin);

// Email/password authentication
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Password reset routes
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Email verification routes
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);

// Temporary route to fix password (remove in production)
router.post("/reset-user-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Set the new password (it will be hashed by the pre-save middleware)
    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ success: false, error: 'Failed to reset password' });
  }
});

// Temporary route to fix password hash (remove in production)
router.post("/fix-password", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, message: 'Password hash updated successfully' });
  } catch (error) {
    console.error('Password fix error:', error);
    res.status(500).json({ success: false, error: 'Failed to update password' });
  }
});

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

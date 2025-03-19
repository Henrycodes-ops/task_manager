// authRoutes.js
const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();

const GOOGLE_CLIENT_ID =
  "1060221181168-tcqc0u99kb3kbnhjrburithdi5ga8cvo.apps.googleusercontent.com";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || JWT_SECRET; // Make sure to use env variables in production

// Google OAuth authentication
router.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Find or create user in your database
    const user = await findOrCreateUser({
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      googleId: payload.sub,
    });

    // Create session token
    const sessionToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token: sessionToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(401).json({ success: false, message: "Invalid authentication" });
  }
});

// Email/password signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
    });

    // Create session token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Could not create user",
    });
  }
});

// Email/password login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create session token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Helper functions - Replace with your actual database implementations
async function findOrCreateUser(userData) {
  // Mock implementation - Replace with your database logic
  // Check if user exists by googleId or email
  // If not, create new user
  // Return user object

  return {
    id: userData.googleId || "user_" + Date.now(),
    email: userData.email,
    name: userData.name,
  };
}

async function findUserByEmail(email) {
  // Mock implementation - Replace with your database query
  // This should be replaced with actual database lookup

  // Simulated user for testing purposes
  return null; // Return null to simulate user not found

  // In a real implementation, return the user if found:
  /*
  return {
    id: "123",
    email: "test@example.com",
    name: "Test User",
    password: "$2b$10$..." // Hashed password
  };
  */
}

async function createUser(userData) {
  // Mock implementation - Replace with your database insert
  // This should create a new user in your database

  return {
    id: "user_" + Date.now(),
    email: userData.email,
    name: userData.name,
  };
}

module.exports = router;

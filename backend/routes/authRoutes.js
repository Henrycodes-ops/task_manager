// authRoutes.js
const express = require("express");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user"); // Make sure this path is correct
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
router.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("Google token payload:", payload); // Log the payload details

    // Find or create user in your database
    const user = await findOrCreateUser({
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      googleId: payload.sub,
    });

    // Create session token
    const sessionToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token: sessionToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(401).json({ success: false, message: "Invalid authentication" });
  }
});

// GitHub OAuth authentication
router.post("/github", async (req, res) => {
  const { code } = req.body;

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const { access_token } = tokenResponse.data;

    // Fetch user details from GitHub
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    const githubUser = userResponse.data;

    // Find or create user in your database
    const user = await findOrCreateGitHubUser({
      githubId: githubUser.id,
      email: githubUser.email || `${githubUser.login}@github.com`,
      name: githubUser.name || githubUser.login,
      picture: githubUser.avatar_url,
    });

    // Create session token
    const sessionToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token: sessionToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("GitHub authentication error:", error);
    res.status(401).json({ 
      success: false, 
      message: "GitHub authentication failed" 
    });
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
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
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
  console.log(`Login attempt for email: ${email}`);

  try {
    // Find user by email
    const user = await findUserByEmail(email);
    console.log("User found:", !!user); // Log if user was found
    if (!user) {
      console.log("No user found with this email");
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user has a password (Google users might not)
    if (!user.password) {
      console.log("User has no password (Google user)");
      return res.status(401).json({
        success: false,
        message: "This account uses Google Sign-In. Please login with Google.",
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", passwordMatch);

    if (!passwordMatch) {
      console.log("Password doesn't match");
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create session token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
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

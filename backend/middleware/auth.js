// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    // Get token from cookie
    let token;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Get token from Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else {
      return res
        .status(401)
        .json({ success: false, error: "No token provided" });
    }

    if (!token) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "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"
    );

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, error: "User not found" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ success: false, error: "Please authenticate" });
  }
};

module.exports = auth;

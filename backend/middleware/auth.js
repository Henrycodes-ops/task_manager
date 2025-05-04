// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    let token;

    // Check for token in cookies first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Then check Authorization header (for non-browser clients or when cookies aren't available)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.log("No authentication token found");
      return res
        .status(401)
        .json({ success: false, error: "Authentication required" });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID
      const user = await User.findById(decoded.userId);

      if (!user) {
        console.log("User not found for token");
        return res
          .status(401)
          .json({ success: false, error: "User not found" });
      }

      // Add user and token to request
      req.user = user;
      req.token = token;
      next();
    } catch (tokenError) {
      console.error("Token verification error:", tokenError);
      return res
        .status(401)
        .json({ success: false, error: "Invalid or expired token" });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ success: false, error: "Authentication error" });
  }
};

module.exports = auth;

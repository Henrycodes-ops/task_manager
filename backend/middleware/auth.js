// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    // Get token from cookie
    const authHeader = req.headers.authorization;


    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secure-jwt-secret');
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ success: false, error: 'Please authenticate' });
  }
};

module.exports = auth;

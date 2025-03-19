// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Protected route
router.get("/profile", auth, async (req, res) => {
  try {
    // req.user contains the user info from the token
    const user = await User.findById(req.user.userId).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

const User = require('../models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const { generateToken } = require('../utils/auth');

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'No account found with this email address' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      message: 'Password reset email sent successfully' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing password reset request' 
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Find user by reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset token' 
      });
    }

    // Update password and clear reset token
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ 
      success: true, 
      message: 'Password reset successful' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error resetting password' 
    });
  }
};

// Google OAuth callback
exports.googleCallback = (req, res) => {
  passport.authenticate('google', { failureRedirect: '/login' })(req, res, () => {
    const token = generateToken(req.user);
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  });
};

// Google OAuth login
exports.googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account'
}); 
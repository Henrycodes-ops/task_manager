const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const { generateToken } = require('../utils/auth');
const bcrypt = require('bcrypt');
const axios = require('axios');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
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

// Google OAuth verification
exports.verifyGoogleToken = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        email: payload.email,
        name: payload.name,
        googleId: payload.sub,
        isVerified: true
      });
    }

    const jwtToken = generateToken(user);
    res.cookie('token', jwtToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ success: true, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ success: false, error: 'Authentication failed' });
  }
};

// Google OAuth callback
exports.googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        email: payload.email,
        name: payload.name,
        googleId: payload.sub,
        isVerified: true
      });
    }

    const jwtToken = generateToken(user);
    res.cookie('token', jwtToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed`);
  }
};

// Google OAuth login
exports.googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account'
});

// GitHub OAuth login
exports.githubLogin = async (req, res) => {
  try {
    const { code } = req.body;
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    }, {
      headers: { Accept: 'application/json' }
    });

    const { access_token } = response.data;
    
    // Get user data
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    // Get user emails
    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const githubUser = userResponse.data;
    const primaryEmail = emailResponse.data.find(email => email.primary)?.email || emailResponse.data[0]?.email;

    if (!primaryEmail) {
      throw new Error('No email found for GitHub user');
    }

    let user = await User.findOne({ githubId: githubUser.id });
    
    if (!user) {
      user = await User.create({
        email: primaryEmail,
        name: githubUser.name || githubUser.login,
        githubId: githubUser.id,
        isVerified: true
      });
    }

    const jwtToken = generateToken(user);
    res.cookie('token', jwtToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ success: true, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('GitHub auth error:', error);
    res.status(500).json({ success: false, error: 'Authentication failed' });
  }
};

// Email/password signup
exports.signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      isVerified: false
    });

    // TODO: Send verification email
    res.status(201).json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
};

// Email/password login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ success: false, error: 'Email not verified' });
    }

    const jwtToken = generateToken(user);
    res.cookie('token', jwtToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ success: true, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
};

// Email verification
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    // TODO: Verify token and update user
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ success: false, error: 'Email verification failed' });
  }
};

// Resend verification email
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, error: 'Email already verified' });
    }

    // TODO: Send verification email
    res.json({ success: true, message: 'Verification email sent' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ success: false, error: 'Failed to resend verification email' });
  }
}; 
// models/user.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function() {
        return !this.googleId && !this.githubId;
      }
    },
    googleId: {
      type: String,
      sparse: true, // Allows null values but ensures uniqueness for non-null values
      unique: true,
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true
    },
    githubAccessToken: {
      type: String,
      sparse: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    picture: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;

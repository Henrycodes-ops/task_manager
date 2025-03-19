
// backend/server.js
const express = require('express');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Now you can access env variables like this
console.log("JWT Secret:", process.env.JWT_SECRET);
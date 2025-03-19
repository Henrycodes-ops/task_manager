
// backend/server.js
const dotenv = require('dotenv');
const express = require('express');
const cors = require("cors");

const app = express();

// Load environment variables from .env file
dotenv.config();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend-domain.com' 
    : 'http://localhost:3000',
  credentials: true, // This allows cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Now you can access env variables like this
console.log("JWT Secret:", process.env.JWT_SECRET);

// Middleware
app.use(express.json());

// API Routes
app.use('/api', routes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// // backend/server.js
// const dotenv = require('dotenv');
// const express = require('express');
// const cors = require("cors");

// const app = express();

// // Load environment variables from .env file
// dotenv.config();

// // CORS configuration
// const corsOptions = {
//   origin: process.env.NODE_ENV === 'production'
//     ? 'https://your-frontend-domain.com'
//     : 'http://localhost:3000',
//   credentials: true, // This allows cookies to be sent with requests
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// };

// app.use(cors(corsOptions));

// // Now you can access env variables like this
// console.log("JWT Secret:", process.env.JWT_SECRET);

// // Middleware
// app.use(express.json());

// // API Routes
// app.use('/api', routes);

// // Start server
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// Choose one approach: Either CommonJS or ES6 Modules
// Option 1: CommonJS (what you're currently using mostly)
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors"); 

// Configure environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Define the port number for the server to listen on
const port = process.env.PORT || 3001;

// Add middleware
app.use(express.json());

// Add CORS middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend-domain.com' 
    : 'http://localhost:5173', // Your Vite dev server port
  credentials: true
}));

// Import route files
const authRoutes = require("./routes/authRoutes");

// Mount API routes
app.use("/api/auth", authRoutes);

// Basic status route
app.get("/api/status", (req, res) => {
  res.json({ status: "Server is running" });
});

// Catch-all handler for the root and other frontend routes
app.get("*", (req, res) => {
  res.send(`
  hi
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

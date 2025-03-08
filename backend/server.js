import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Configure environment variables
dotenv.config();

// Convert __dirname to work with ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// Define the port number for the server to listen on
const port = process.env.PORT || 5000;

// Add middleware to parse JSON
app.use(express.json());

// API routes
app.get("/api/status", (req, res) => {
  res.json({ status: "Server is running" });
});

// Catch-all handler for the root and other frontend routes
app.get("*", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>TaskFlow.ai</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          h1 { color: #4a90e2; }
          p { margin: 20px 0; }
          .status { padding: 10px; background-color: #e8f4ff; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <h1>TaskFlow.ai API Server</h1>
        <p>The backend server is running correctly.</p>
        <div class="status">Server status: Online</div>
        <p>If you're trying to access the frontend, please make sure the frontend development server is running.</p>
        <p>Navigate to <a href="http://localhost:3000">http://localhost:3000</a> to view your React application.</p>
      </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

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

// API routes go here
app.get("/api/status", (req, res) => {
  res.json({ status: "Server is running" });
});

// For development purposes, serve the React app from the frontend folder
if (process.env.NODE_ENV === "development") {
  // This is for development only - in production, you'll serve the built files
  app.use(express.static(path.join(__dirname, "..", "frontend", "src")));

  // Serve index.html for any other routes
  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "..", "frontend", "public", "index.html")
    );
  });
}

// For production, serve from the build folder
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "frontend", "build")));

  // Serve index.html for any other routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

console.log("Server is running...");

// Convert __dirname to work with ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Define the port number for the server to listen on
const PORT = 4000; // Change if necessary

console.log(`Server is running on http://localhost:${PORT}`);
// Serve static files from the "src" directory
app.use(express.static(path.join(__dirname, "frontend", "src")));
app.use(express.static(path.join(__dirname, "src")));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "src", "index.html"));
//   console.log(res);
  
// });


const sendAppFile = (req, res) => {
  console.log("Sending App.jsx file...");
  const appPath = process.env.APP_PATH || path.join(__dirname, "frontend", "src", "App.jsx");
  res.sendFile(appPath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
    } else {
      console.log("App.jsx file sent successfully!");
    }
  });
};

app.get("/", sendAppFile);






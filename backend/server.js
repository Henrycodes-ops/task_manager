import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const app = express();

 console.log("Server is running...");

// Convert __dirname to work with ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 5000; // Change if necessary

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use(express.static(path.join(__dirname, "public")));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
//   console.log(res);
  
// });



app.get("/", (req, res) => {
  console.log("Sending App.jsx file...");

  // res.send("Welcome to the backend server!");
  res.sendFile(path.join(__dirname, "frontend", "src", "App.jsx"), (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("App.jsx file sent successfully!");
    }
  });
});






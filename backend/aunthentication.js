const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3001;


const corsOptions = {
  origin: ["http://localhost:5173"], // Replace with your frontend URL
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cors());

const GOOGLE_CLIENT_ID =
  "1060221181168-tcqc0u99kb3kbnhjrburithdi5ga8cvo.apps.googleusercontent.com";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET; // Make sure this is set in your .env file

app.post("/api/auth/google", async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Check if user exists in your database, if not create them
    const user = await findOrCreateUser({
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      googleId: payload.sub,
    });

    // Create a session token for your app
    const sessionToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token: sessionToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(401).json({ success: false, message: "Invalid authentication" });
  }
});

// Mock function - Replace with actual database logic
async function findOrCreateUser(userData) {
  // Example: Check if user exists in database
  // If not, create a new user
  return {
    id: "123",
    email: userData.email,
    name: userData.name,
  };
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

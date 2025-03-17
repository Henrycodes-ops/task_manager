const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const JWT_SECRET = "your_jwt_secret"; // Use a strong secret in production

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

// Mock function - implement according to your database
async function findOrCreateUser(userData) {
  // Check if user exists in database
  // If not, create a new user
  // Return user object
  return {
    id: "123",
    email: userData.email,
    name: userData.name,
  };
}

app.listen(3001, () => {
  console.log("Server running on port 3001");
});

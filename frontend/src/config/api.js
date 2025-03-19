// frontend/src/config/api.js
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-production-domain.com/api"
    : "http://localhost:3001/api";

export default {
  auth: {
    login: `${API_URL}/auth/login`,
    signup: `${API_URL}/auth/signup`,
    google: `${API_URL}/auth/google`,
  },
  users: {
    profile: `${API_URL}/users/profile`,
    // other user endpoints
  },
  // Add other API endpoints here
};

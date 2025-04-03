// frontend/src/config/api.js
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === "production"
    ? "https://your-production-domain.com/api"
    : "http://localhost:3001/api");

const GITHUB_CLIENT_ID = "Ov23li0Zf2FMhySKZ9uP";
const GOOGLE_CLIENT_ID = "1060221181168-tcqc0u99kb3kbnhjrburithdi5ga8cvo.apps.googleusercontent.com";

export default {
  auth: {
    login: `${API_URL}/auth/login`,
    signup: `${API_URL}/auth/signup`,

    google: `${API_URL}/auth/google`,
    github: `${API_URL}/auth/github`,
    githubClientId: GITHUB_CLIENT_ID,
    githubRedirectUri: "http://localhost:5173/signup",
    googleClientId: GOOGLE_CLIENT_ID
  },
  users: {
    profile: `${API_URL}/users/profile`,
  },
};

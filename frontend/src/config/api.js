// frontend/src/config/api.js
const API_URL = 'http://localhost:3001/api';

const GITHUB_CLIENT_ID = "Ov23li0Zf2FMhySKZ9uP";
const GOOGLE_CLIENT_ID = "1060221181168-tcqc0u99kb3kbnhjrburithdi5ga8cvo.apps.googleusercontent.com";

const api = {
  auth: {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`,
    signup: `${API_URL}/auth/signup`,
    logout: `${API_URL}/auth/logout`,
    forgotPassword: `${API_URL}/auth/forgot-password`,
    resetPassword: `${API_URL}/auth/reset-password`,
    verifyEmail: `${API_URL}/auth/verify-email`,
    resendVerification: `${API_URL}/auth/resend-verification`,

    google: `${API_URL}/auth/google`,
    github: `${API_URL}/auth/github`,
    githubClientId: GITHUB_CLIENT_ID,
    githubRedirectUri: "http://localhost:5173/signup",
    googleClientId: GOOGLE_CLIENT_ID,
    googleRedirectUri: "http://localhost:5173/auth/google/callback",
  },
  user: {
    profile: `${API_URL}/users/profile`,
    update: `${API_URL}/users/update`,
    changePassword: `${API_URL}/users/change-password`,
  },
  tasks: {
    list: `${API_URL}/tasks`,
    create: `${API_URL}/tasks`,
    update: `${API_URL}/tasks`,
    delete: `${API_URL}/tasks`,
  },
  ai: {
    suggest: `${API_URL}/ai/suggest`,
  },
  github: {
    repos: `${API_URL}/github/repos`,
    branches: `${API_URL}/github/branches`,
  },
};

export default api;

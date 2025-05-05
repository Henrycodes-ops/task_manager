import axios from "axios";
import { getToken } from "../utils/auth";

const API_URL = "http://localhost:3001/api";

// Define API endpoints
const endpoints = {
  auth: {
    login: `/auth/login`,
    register: `/auth/register`,
    signup: `/auth/signup`,
    logout: `/auth/logout`,
    resetUserPassword: `/auth/reset-user-password`,
    fixPassword: `/auth/fix-password`,
    verifyEmail: `/auth/verify-email`,
    resendVerification: `/auth/resend-verification`,
    google: `/auth/google`,
    github: `/auth/github`,
  },
  user: {
    profile: `/users/profile`,
    update: `/users/update`,
    changePassword: `/users/change-password`,
  },
  tasks: {
    list: `/tasks`,
    create: `/tasks`,
    update: (id) => `/tasks/${id}`,
    delete: (id) => `/tasks/${id}`,
  },
  ai: {
    suggest: `/ai/suggest`,
  },
  github: {
    repos: `/github/repos`,
    branches: `/github/branches`,
  },
};

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Initialize with stored token if available
const token = getToken();
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // We could handle token refresh or redirect to login here
      console.log("Authentication error - user not found or token invalid");
    }
    return Promise.reject(error);
  }
);

// Wrapper for authenticated fetch
export const fetchWithAuth = async (url, options = {}) => {
  try {
    const token = getToken();
    const headers = {
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
      withCredentials: true,
    };

    const response = await api(url, config);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

// Common API methods
export const fetchProfile = async () => {
  return fetchWithAuth("/users/profile", { method: "GET" });
};

export const fetchTasks = async () => {
  return fetchWithAuth("/tasks", { method: "GET" });
};

export const createTask = async (taskData) => {
  return fetchWithAuth("/tasks", {
    method: "POST",
    data: taskData,
  });
};

// Add endpoints to the api object
api.endpoints = endpoints;

export default api;

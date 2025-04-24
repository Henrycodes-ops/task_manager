import { getToken } from "./auth";

// Helper for consistent API calls
export const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // This ensures cookies are sent with the request
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`API Error (${response.status}):`, errorData);
    throw new Error(errorData.error || "Request failed");
  }

  return response.json();
};

// Create a base API configuration for axios
import axios from "axios";

// Configure axios defaults
const api = axios.create({
  baseURL: "http://localhost:3001", // Make sure this matches your backend URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add auth token to all requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export default {
  tasks: {
    list: "/api/tasks",
    create: "/api/tasks",
    update: "/api/tasks",
    delete: "/api/tasks",
  },
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    logout: "/api/auth/logout",
  },
  user: {
    profile: "/api/users/profile",
  },
};

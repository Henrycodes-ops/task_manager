// src/utils/auth.js
import axios from "axios";

// Set the base URL for API requests
const API_URL = "http://localhost:3001/api";

// Store user data in localStorage
export const login = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  // Set the default Authorization header for all future requests
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const logout = () => {
  // Clear from localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Clear axios default headers
  delete axios.defaults.headers.common["Authorization"];

  // Call the backend logout endpoint to clear the cookie
  return axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  return !getToken();
};

// Setup axios interceptors for authentication
export const setupAuthInterceptors = () => {
  // Request interceptor
  axios.interceptors.request.use(
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

  // Response interceptor to handle auth errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Token expired or invalid
        logout();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
};

// Initialize auth state from localStorage on app load
export const initializeAuth = () => {
  const token = getToken();
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  setupAuthInterceptors();
};

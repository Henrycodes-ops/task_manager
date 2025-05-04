// src/utils/api.js
import axios from "axios";
import { getToken } from "./auth";

const API_URL = "http://localhost:3001/api";

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

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

    // Check if the error is due to authentication
    if (error.response?.status === 401) {
      console.log("Authentication error - user not found or token invalid");
    }

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

export default api;

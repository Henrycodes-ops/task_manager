// frontend/src/utils/auth.js

// Local storage keys
const USER_KEY = "user_data";
import api from "./api";

// Login function - stores user data in localStorage
// Token is handled by HTTP-only cookie
export const login = (token, user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  localStorage.setItem("auth_token", token); 
};

// Logout function - clears user data and makes logout request
export const logout = async () => {
  try {
    // Clear user from localStorage
    localStorage.removeItem(USER_KEY);

    // Call logout endpoint to clear the cookie
    await fetch(api.endpoints.auth.login, {
      method: "POST",
      credentials: "include",
    });

    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};

// Get user data
export const getUser = () => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getUser();
};


// Add this function for token retrieval
export const getToken = () => {
  // If using localStorage:
  // const user = getUser();
  // return user?.token || '';

  // Or if using cookies (requires a cookie parsing utility):
  return getUser('auth_token') || '';

  // Or if your auth flow is using session cookies managed by the browser:
  // In this case, you might not need to explicitly set the Authorization header,
  // as cookies are automatically sent with requests if withCredentials is true
  

  // return localStorage.getItem("auth_token") || "";
};

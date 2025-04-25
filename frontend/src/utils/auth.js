// frontend/src/utils/auth.js

// Local storage keys
const USER_KEY = "user_data";

// Login function - stores user data in localStorage
// Token is handled by HTTP-only cookie
export const login = (token, user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Logout function - clears user data and makes logout request
export const logout = async () => {
  try {
    // Clear user from localStorage
    localStorage.removeItem(USER_KEY);

    // Call logout endpoint to clear the cookie
    await fetch("http://localhost:3001/api/auth/logout", {
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
  // Since you're using HTTP-only cookies for the token,
  // you probably don't have direct access to it in JavaScript.
  // This is just a placeholder that would return an empty string
  // or a token if you have it stored in localStorage
  
  // If you're storing token in localStorage:
  // return localStorage.getItem(TOKEN_KEY) || '';
  
  // If using HTTP-only cookies only:
  return ''; // Cookie will be sent automatically with credentials: 'include'
};

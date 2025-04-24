// frontend/src/utils/auth.js
export const login = (token, user) => {
  // Only store user data in localStorage, token is handled by HTTP-only cookie
  localStorage.setItem("user", JSON.stringify(user));
};

export const logout = () => {
  // Clear user data from localStorage
  localStorage.removeItem("user");
};

// export const getToken = () => {
  
//   return localStorage.getItem("token");
// };

// export const getUser = () => {
//   const user = localStorage.getItem("user");
//   return user ? JSON.parse(user) : null;
// };

// export const isAuthenticated = () => {
//   // Since we're using HTTP-only cookies, we can check if we have user data
//   return !!getUser();
// };

// Local storage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Set token and user data
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Get token and user data
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getUser = () => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Clear authentication data on logout
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// frontend/src/utils/auth.js
export const login = (token, user) => {
  // Only store user data in localStorage, token is handled by HTTP-only cookie
  localStorage.setItem("user", JSON.stringify(user));
};

export const logout = () => {
  // Clear user data from localStorage
  localStorage.removeItem("user");
};

export const getToken = () => {
  
  return localStorage.getItem("token");
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  // Since we're using HTTP-only cookies, we can check if we have user data
  return !!getUser();
};

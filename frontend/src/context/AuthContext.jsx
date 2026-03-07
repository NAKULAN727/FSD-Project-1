import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Configure axios defaults
  const API = import.meta.env.VITE_API_URL;
  axios.defaults.baseURL = API;

  useEffect(() => {
    // Check for token and user on load
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const data = response.data;

      setCurrentUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Set axios header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || error.message || "Login failed"
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post("/api/auth/register", userData);
      if (response.status === 201) {
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || error.message || "Registration failed"
      };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = {
    currentUser,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

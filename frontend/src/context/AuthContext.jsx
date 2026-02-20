import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("so_clone_current_user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        "so_clone_current_user",
        JSON.stringify(currentUser),
      );
    } else {
      localStorage.removeItem("so_clone_current_user");
    }
  }, [currentUser]);

  const login = async (email, password) => {
    const API = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentUser(data);
        return { success: true };
      }
      return { success: false, message: data.error || "Login failed" };
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  };

  const register = async (email, password, displayName) => {
    const API = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true };
      }
      return { success: false, message: data.error || "Registration failed" };
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

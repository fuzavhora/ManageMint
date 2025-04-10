// src/context/AuthContext.jsx
import { createContext, useState, useContext } from "react";
import instance from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = async (url, data) => {
    setLoading(true);
    try {
      const response = await instance.post(`${url}`, data);
      setUser(response.data.user);
      setError(null);
      return response; // Return the response for further use
    } catch (err) {
      console.error("Fetch user error:", err);
      setUser(null);
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        error,
        setError,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

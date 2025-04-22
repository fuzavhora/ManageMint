// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import instance from "../api/axios";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  const fetchUser = async (url, data, method = 'POST') => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios({
        method: method,
        url: `http://localhost:5500/api/${url}`,
        data: method !== 'GET' ? data : data,
        params: method === 'GET' ? data : undefined,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
      });
      
      return response;
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong");
      throw error;
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
        error,
        setLoading,
        setError,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

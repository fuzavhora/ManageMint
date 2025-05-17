// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import instance from "../api/axios";

import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = async (url, data, method = "POST") => {
    setLoading(true);
    setError(null);

    try {
      const response = await instance({
        method,
        url: `/${url}`, // baseURL already includes `/api`
        data: method !== "GET" ? data : undefined,
        params: method === "GET" ? data : undefined,
      });

      return response;
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Inside AuthProvider
  const logout = async () => {
    try {
      setLoading(true);

      await instance.post("/auth/logout", {}, { withCredentials: true });

      setUser(null);
      localStorage.removeItem("token");

      toast.success("Logout successful");
    } catch (error) {
      toast.error("Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  const getUserAccount = async (userId) => {
    try {
      const res = await instance.post(`/user/accounts/${userId}`);
      return res.data.userAccount;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to fetch account details"
      );
      return null;
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
        logout,
        getUserAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

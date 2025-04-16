// src/api/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5500/api/", // your backend base URL
  withCredentials: true, // send cookies
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token !== null) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

export default instance;

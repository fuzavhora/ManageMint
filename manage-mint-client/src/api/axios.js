// src/api/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // your backend base URL
  withCredentials: true, // send cookies
});

export default instance;

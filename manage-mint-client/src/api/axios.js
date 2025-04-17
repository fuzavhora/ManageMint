// src/api/axios.js
import axios from "axios";

// Update baseURL to match your environment configuration
const instance = axios.create({
  baseURL: "http://localhost:5500/api/"
});

// Request interceptor

// Response interceptor


export default instance;

import axios from 'axios';

const token = localStorage.getItem('token');

const instance = axios.create({
  baseURL: 'http://localhost:5500/api',
  'authorization': `${token}`,
});

// Add response interceptor for error handling


export default instance;

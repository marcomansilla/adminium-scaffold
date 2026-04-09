// src/boot/axios.js
import { boot } from 'quasar/wrappers';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3100/api',  // Match your backend port
  timeout: 10000
});

// Request interceptor - MAKE SURE THIS IS RUNNING
api.interceptors.request.use(
  config => {
    const token = window.localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set:', config.headers.Authorization); // Debug
    }

    console.log('Final URL:', config.baseURL + config.url); // Debug
    return config;
  },
  error => Promise.reject(error)
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api }

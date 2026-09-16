// src/boot/axios.js
import { boot } from 'quasar/wrappers';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3100/api',
  timeout: 10000
});

// Request interceptor - ALWAYS add token from localStorage
api.interceptors.request.use(
  config => {
    const token = window.localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('Request:', config.method.toUpperCase(), config.url, 'Token:', token);
    return config;
  },
  error => Promise.reject(error)
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api }

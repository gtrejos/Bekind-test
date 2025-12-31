import axios from 'axios';

// Cliente para Auth 
export const authApi = axios.create({
  baseURL: 'https://dev.apinetbo.bekindnetwork.com/api',
  headers: { 'Content-Type': 'application/json' }
});

// Cliente para Actions (api)
export const mainApi = axios.create({
  baseURL: 'https://dev.api.bekindnetwork.com/api/',
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor: Inyectar el token automáticamente
mainApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('bekind_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));
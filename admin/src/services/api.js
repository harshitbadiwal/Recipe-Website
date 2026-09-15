import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.apiBaseUrl || 'https://recipe-website-ja3v.onrender.com/api/v1',
  timeout: 35000,
});

// Helper to retrieve the current auth token
export const getAuthToken = () => {
  try {
    const directToken = localStorage.getItem('recipe_admin_token');
    if (directToken && directToken !== 'null' && directToken !== 'undefined' && !directToken.startsWith('mock-')) {
      return directToken;
    }

    const persisted = localStorage.getItem('recipe-admin-recipe-admin-auth');
    if (persisted) {
      const parsed = JSON.parse(persisted);
      if (parsed?.token && !parsed.token.startsWith('mock-')) {
        return parsed.token;
      }
    }
  } catch (e) {
    // Ignore JSON errors
  }
  return null;
};

// Helper to set auth token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('recipe_admin_token', token);
  } else {
    localStorage.removeItem('recipe_admin_token');
  }
};

// Request Interceptor: Inject Authorization Bearer token into ALL outgoing requests
api.interceptors.request.use(
  (reqConfig) => {
    const token = getAuthToken();
    if (token) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    return reqConfig;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract response data and handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    // If unauthorized or token expired, clean token and redirect to login
    if (status === 401) {
      setAuthToken(null);
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(errorMsg));
  }
);

export default api;

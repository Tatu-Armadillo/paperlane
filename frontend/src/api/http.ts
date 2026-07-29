import axios from 'axios';

const BASE = import.meta.env.VITE_BACKEND_URL;
if (!BASE) {
  console.warn('[paperlane] VITE_BACKEND_URL is not defined. API calls will fail.');
}

export const API_ROOT = `${BASE}/api`;

const http = axios.create({
  baseURL: API_ROOT,
  timeout: 60_000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (r) => r,
  (err) => {
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      'Request failed';

    const normalized = Array.isArray(message) ? message.join(', ') : message;
    err.paperlaneMessage = normalized;

    return Promise.reject(err);
  },
);

export default http;
import axios from 'axios';

const BASE = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_REACT_APP_BACKEND_URL;
if (!BASE) {
  // eslint-disable-next-line no-console
  console.warn('[paperlane] VITE_BACKEND_URL is not defined. API calls will fail.');
}

export const API_ROOT = `${BASE}/api`;

const http = axios.create({
  baseURL: API_ROOT,
  timeout: 60_000,
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

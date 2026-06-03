import axios from "axios";
import toast from "react-hot-toast"; // ✅ Add this import

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000", // ✅ Remove trailing slash
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Optional helper
export const setAuthToken = (token?: string) => {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// // Response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.code === 'ERR_NETWORK') {
//       console.error('Network Error - Server might be down:', error.message);
//       toast.error('Cannot connect to server. Please check if the server is running.');
//     } else if (error.code === 'ECONNREFUSED') {
//       console.error('Connection Refused - Server not running on port');
//       toast.error('Server connection refused. Please start the backend server.');
//     } else if (error.code === 'ETIMEDOUT') {
//       console.error('Timeout - Server taking too long to respond');
//       toast.error('Request timeout. Please try again.');
//     } else if (error.response?.status === 401) {
//       toast.error('Unauthorized. Please login again.');
//     } else if (error.response?.status === 403) {
//       toast.error('Access denied.');
//     } else if (error.response?.status === 404) {
//       toast.error('Resource not found.');
//     } else if (error.response?.status === 500) {
//       toast.error('Server error. Please try again later.');
//     }
//     return Promise.reject(error);
//   }
// );
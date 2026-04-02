import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Optional helper
export const setAuthToken = (token?: string) => {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
};

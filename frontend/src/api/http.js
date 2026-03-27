import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const http = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export const attachAuthInterceptor = (getToken) => {
  http.interceptors.request.use((config) => {
    const token = getToken?.();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};


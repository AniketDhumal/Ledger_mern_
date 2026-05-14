import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // e.g.,import.meta.env.VITE_API_BASE
});

api.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export default api;

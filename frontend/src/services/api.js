import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  timeout: 30000,
});

// Otomatis sisipkan token di setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("🔑 Token:", token ? token.substring(0, 20) + "..." : "TIDAK ADA");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => api.post("/auth/register", data);
export const login    = (data) => api.post("/auth/login", data);
export const getMe    = ()     => api.get("/auth/me");

// Foods
export const searchFoods = (q)    => api.get(`/foods/search?q=${q}`);

// Logs
export const addLog        = (data) => api.post("/logs/", data);
export const getTodayLogs  = ()     => api.get("/logs/today");
export const getWeekly     = ()     => api.get("/logs/weekly");

// AI
export const detectFood = (image_base64) =>
  api.post("/ai/detect", { image_base64 });

export default api;
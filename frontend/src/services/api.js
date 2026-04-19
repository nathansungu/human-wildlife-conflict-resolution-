import axios from "axios";
import { navigateTo } from "../utilities/navigate";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Response interceptor for handling authentication errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (originalRequest.url.includes("/users/refresh-token")) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/users/refresh-token");
        return api.request(originalRequest);
      } catch (refreshError) {
        navigateTo("/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// authService
export const authService = {
  login: (credentials) => api.post("/users/login", credentials),
  subscribe: (data) => api.post("/users/subscribe", data),
  getMe: () => api.get("/users/me"),
};

// userService
export const userService = {
  register: (data) => api.post("/users/register", data),
  getAll: () => api.get("/users"),
  update: (data) => api.patch("/users", data),
};

//cameraService
export const cameraService = {
  getAll: (params) => api.get("/cameras", { params }),
  getById: (id) => api.get(`/cameras/${id}`),
  create: (data) => api.post("/cameras", data),
  updateStatus: (data) => api.put("/cameras/", { ...data }),
  delete: (id) => api.put(`/cameras/`, { id, isActive: false }),
};

//detectionService
export const detectionService = {
  getAll: (params) => api.get("/detections/", { params }),
  getDailyReport: (params) => api.get("/detections/daily-report", { params }),
  record: (data) => api.post("/detections", data),
  verify: (data) => api.put("/detections", data),
  getAllReports: () => api.get("/detections/reports"),
  restartDetectionService: () => api.post("/detections/restart"),
};

//dashboardService
export const dashboardService = {
  getStats: () => api.get("/detections/dashboard-stats"),
  getRecentDetections: (limit = 10) =>
    api.get(`/detections/detections?limit=${limit}`),
};

export default api;

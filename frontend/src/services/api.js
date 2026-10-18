import axios from "axios";
import { getAdminToken } from "./adminToken";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Chỉ đọc token trong trình duyệt, không ảnh hưởng API gọi ở Server Component.
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const isAdminRequest = config.url?.startsWith("/admin/");
    const token = isAdminRequest ? getAdminToken() : window.localStorage.getItem("stylerent.auth.token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

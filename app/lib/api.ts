import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-shamel.tmt3.sa/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ← أضف هذا
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient; 
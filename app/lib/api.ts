import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1" ;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // أضف هذا السطر لضمان عمل الحماية والجلسات مستقبلاً
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export default apiClient;
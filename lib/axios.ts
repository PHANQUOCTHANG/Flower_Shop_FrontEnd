/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth.store";

// Extend config type để đánh dấu retry
interface CustomConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Endpoint constants
const REFRESH_TOKEN_ENDPOINT = "/auth/refresh-token";

// Instance chính: gửi request với access token
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Instance riêng: refresh token (tránh vòng lặp interceptor)
const refreshClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Lock để tránh gọi refresh token nhiều lần cùng lúc
let refreshPromise: Promise<string> | null = null;

/**
 * Request interceptor: gắn access token vào header
 */
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  console.log(token)
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Lấy access token mới từ server
 */
const requestNewAccessToken = async (): Promise<string> => {
  try {
    const response = await refreshClient.post(REFRESH_TOKEN_ENDPOINT, null, {
      timeout: 10000,
    });

    console.log("[Axios Refresh] Success:", response.data);


    // Handle cả 2 response format: accessToken | data.accessToken
    const newAccessToken =
      response.data?.accessToken || response.data?.data?.accessToken;

    if (!newAccessToken) {
      throw new Error("No access token in refresh response");
    }

    // Update token trong store
    useAuthStore.getState().setAccessToken(newAccessToken);

    return newAccessToken;
  } 
  
  catch (error) {
    throw error;
  }
};

/**
 * Response interceptor: handle 401 errors và refresh token
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomConfig;

    // Guard: kiểm tra request/response tồn tại
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    // Nếu không phải 401 thì skip
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Nếu endpoint refresh token bị 401 → logout
    if (originalRequest.url?.includes(REFRESH_TOKEN_ENDPOINT)) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    // Nếu đã retry → không retry lại
    if (originalRequest._retry) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Tạo promise refresh nếu chưa có
      if (!refreshPromise) {
        refreshPromise = requestNewAccessToken();
      }

      // Đợi refresh xong
      const newToken = await refreshPromise;
      refreshPromise = null;

      // Retry request với token mới
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError: any) {
      refreshPromise = null;

      const refreshStatus = refreshError?.response?.status;
      const isTimeout = refreshError?.message?.includes("timeout");

      // Logout nếu refresh fail
      if ([400, 401, 403].includes(refreshStatus) || isTimeout) {
        console.warn("[Axios] Logout triggered by refresh failure");
        useAuthStore.getState().logout();
      }

      return Promise.reject(refreshError);
    }
  },
);

export default api;

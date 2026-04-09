import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/stores/auth.store";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CustomConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshTokenResponse {
  accessToken?: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    avatar?: string;
    role?: string;
  };
  data?: {
    accessToken?: string;
    user?: {
      id: string;
      email: string;
      fullName: string;
      avatar?: string;
      role?: string;
    };
  };
}

// ─── Constants ───────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const REFRESH_ENDPOINT = "/auth/refresh-token";

/**
 * Các endpoint không cần xử lý refresh logic khi nhận 401.
 * Login sai mật khẩu trả về 401 → không được phép trigger refresh.
 */
const AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  REFRESH_ENDPOINT,
];

// ─── Instances ────────────────────────────────────────────────────────────────

/**
 * Instance chính dùng cho toàn bộ app.
 * Request interceptor tự động gắn access token vào header.
 */
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

/**
 * Instance riêng chỉ để gọi refresh token.
 * Tách ra để tránh vòng lặp interceptor vô hạn.
 */
const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

// ─── Refresh lock ─────────────────────────────────────────────────────────────

/**
 * Singleton promise để đảm bảo chỉ có đúng 1 lần gọi refresh
 * dù nhiều request cùng lúc nhận 401.
 * finally() đảm bảo lock luôn được giải phóng dù success hay fail.
 */
let refreshPromise: Promise<string> | null = null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isAuthEndpoint = (url?: string): boolean =>
  AUTH_ENDPOINTS.some((endpoint) => url?.includes(endpoint));

const isRetryableStatus = (status?: number): boolean =>
  status !== undefined && [400, 401, 403].includes(status);

const extractAccessToken = (data: RefreshTokenResponse): string | null =>
  data?.accessToken ?? data?.data?.accessToken ?? null;

const logout = (): void => useAuthStore.getState().logout();

// ─── Core: refresh token ──────────────────────────────────────────────────────

const requestNewAccessToken = async (): Promise<string> => {
  const response: AxiosResponse<RefreshTokenResponse> =
    await refreshClient.post(REFRESH_ENDPOINT);

  const newToken = extractAccessToken(response.data);

  if (!newToken) {
    throw new Error("No access token in refresh response");
  }

  // Lấy user từ response (backend trả về cùng với accessToken)
  const userData = response.data?.user ?? response.data?.data?.user;

  if (userData) {
    // Update đầy đủ cả token lẫn user để Zustand nhất quán
    useAuthStore.getState().setAuth(newToken, {
      id: userData.id,
      email: userData.email,
      name: userData.fullName,
      role: userData.role,
    });
  } else {
    // Fallback: chỉ update token (isAuthenticated = true được set trong setAccessToken)
    useAuthStore.getState().setAccessToken(newToken);
  }

  return newToken;
};

// ─── Request interceptor ──────────────────────────────────────────────────────

api.interceptors.request.use((config) => {
  // Guard SSR: window chưa tồn tại trong Next.js server-side
  if (typeof window === "undefined") return config;

  const token = useAuthStore.getState().accessToken;

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ─── Response interceptor ────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as CustomConfig | undefined;

    // Guard: không có response hoặc request config
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const { status } = error.response;

    // Chỉ xử lý lỗi 401
    if (status !== 401) {
      return Promise.reject(error);
    }

    // FIX: Bỏ qua các auth endpoint (login, register, v.v.)
    // Đây là lý do trước đây login sai lại báo "missing refresh token":
    // interceptor không skip /auth/login nên cứ 401 là đi refresh.
    if (isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    // FIX: Bỏ qua nếu request gốc không có Authorization header
    // (request public, không cần auth)
    if (!originalRequest.headers.Authorization) {
      return Promise.reject(error);
    }

    // Đã retry rồi → không thử thêm, logout luôn
    if (originalRequest._retry) {
      logout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Dùng finally để đảm bảo lock luôn được reset,
      // tránh trường hợp refreshPromise bị treo do exception bất ngờ
      if (!refreshPromise) {
        refreshPromise = requestNewAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;

      // Retry request gốc với token mới
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      const axiosRefreshError = refreshError as AxiosError;
      const refreshStatus = axiosRefreshError?.response?.status;
      const isTimeout = axiosRefreshError?.code === "ECONNABORTED";

      if (isRetryableStatus(refreshStatus) || isTimeout) {
        console.debug("[Axios] Refresh failed - logging out user");
        logout();
      }

      // Retornar erro sem logar no console para 401s esperados (cookies expirados)
      return Promise.reject(refreshError);
    }
  },
);

export default api;

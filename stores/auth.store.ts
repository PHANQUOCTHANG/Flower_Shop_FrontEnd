import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string; // ID người dùng
  email: string; // Email đăng nhập
  name: string; // Tên hiển thị
  role?: string; // Vai trò (admin, user, ...)
  avatar?: string | null;
  phone?: string | null;
  gender?: string | null;
}

interface AuthState {
  accessToken: string | null; // JWT access token dùng cho API requests
  user: User | null; // Thông tin user (lưu ở localStorage)
  isAuthenticated: boolean; // Trạng thái đăng nhập hiện tại
  isHydrated: boolean; // Zustand tải xong từ localStorage chưa?
  hasLoggedIn: boolean; // Từng login lần nào? (dùng để persist login state)

  setAuth: (token: string, user: User) => void; // Lưu token + user khi login/refresh thành công
  setAccessToken: (token: string) => void; // Cập nhật token mới khi refresh (giữ user info)
  logout: () => void; // Xóa tất cả auth data
  setHydrated: (hydrated: boolean) => void; // Đánh dấu hydration xong
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      hasLoggedIn: false,

      setAuth: (
        token,
        user, // Login thành công: lưu token + user info
      ) =>
        set({
          accessToken: token,
          user,
          isAuthenticated: true,
          hasLoggedIn: true,
        }),

      setAccessToken: (
        token, // Token refresh: cập nhật token, giữ user cũ
      ) =>
        set({
          accessToken: token,
          isAuthenticated: true,
        }),

      logout: () =>
        // Logout: xóa sạch auth data
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
          hasLoggedIn: false,
        }),

      setHydrated: (
        hydrated, // Zustand hydrate xong: set flag này
      ) =>
        set({
          isHydrated: hydrated,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        // Lưu vào localStorage: token, user, login history
        accessToken: state.accessToken,
        user: state.user,
        hasLoggedIn: state.hasLoggedIn,
      }),
      onRehydrateStorage: () => (state) => {
        // Tải từ localStorage xong: tính toán isAuthenticated
        if (state) {
          state.isAuthenticated = !!state.accessToken && !!state.user;
          state.isHydrated = true;
        }
      },
    },
  ),
);

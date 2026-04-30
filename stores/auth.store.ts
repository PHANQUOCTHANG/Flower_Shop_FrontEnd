import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
  fullName?: string;
  role?: string;
  avatar?: string | null;
  phone?: string | null;
  gender?: string | null;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  // isSessionReady = true khi:
  //   (A) user đã có token trong localStorage (set ngay trong onRehydrateStorage - đồng bộ)
  //   (B) SessionProvider đã chạy xong refresh-token (có hoặc không có token)
  // Dùng để gate các fetch data cần auth (cart, profile, ...)
  isSessionReady: boolean;
  hasLoggedIn: boolean;

  setAuth: (token: string, user: User) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  setSessionReady: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      isSessionReady: false,
      hasLoggedIn: false,

      setAuth: (token, user) =>
        set({
          accessToken: token,
          user,
          isAuthenticated: true,
          isSessionReady: true, // Login xong → session sẵn sàng ngay
          hasLoggedIn: true,
        }),

      setAccessToken: (token) =>
        set({
          accessToken: token,
          isAuthenticated: true,
          isSessionReady: true,
        }),

      logout: () =>
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
          isSessionReady: true, // Phiên đã được chốt là "Chưa đăng nhập", nên ready = true để UI ngưng render Skeleton
          hasLoggedIn: false,
        }),

      setSessionReady: () =>
        set({ isSessionReady: true }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        // Chỉ lưu những gì cần thiết vào localStorage
        accessToken: state.accessToken,
        user: state.user,
        hasLoggedIn: state.hasLoggedIn,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const hasSession = !!state.accessToken && !!state.user;
        state.isAuthenticated = hasSession;
        state.isHydrated = true;
        // ✅ KEY FIX: set ngay đồng bộ, trước lần render đầu tiên
        // Nếu user đã có token → isSessionReady = true ngay từ đầu
        // → useFetchCart chạy ngay, KHÔNG cần chờ useEffect của SessionProvider
        state.isSessionReady = hasSession;
      },
    },
  ),
);

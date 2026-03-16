import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  // Login: cập nhật token + user
  setAuth: (token: string, user: User) => void;
  // Refresh: chỉ cập nhật token (user giữ nguyên)
  setAccessToken: (token: string) => void;
  logout: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: (token, user) =>
        set({
          accessToken: token,
          user,
          isAuthenticated: true,
        }),

      setAccessToken: (token) =>
        set({
          accessToken: token,
        }),

      logout: () =>
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        }),

      setHydrated: (hydrated) =>
        set({
          isHydrated: hydrated,
        }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        // Sau khi hydrate, tính toán lại isAuthenticated dựa trên accessToken
        if (state) {
          state.isAuthenticated = !!state.accessToken && !!state.user;
          state.isHydrated = true;
        }
      },
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    },
  ),
);

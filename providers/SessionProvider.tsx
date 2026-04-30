"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { refreshSessionService } from "@/features/auth/services/authService";

/**
 * SessionProvider — xử lý "cold start":
 * Khi user mở trang mà KHÔNG có token trong localStorage
 * nhưng vẫn còn refreshToken cookie (ví dụ: clear localStorage, mở tab mới).
 *
 * Flow:
 *  A. Có token trong localStorage
 *     → isSessionReady đã = true từ onRehydrateStorage (đồng bộ)
 *     → useFetchCart chạy ngay từ render đầu tiên ✅ (KHÔNG cần chờ useEffect)
 *     → SessionProvider không làm gì thêm.
 *
 *  B. Không có token (localStorage trống hoặc expired)
 *     → isSessionReady = false
 *     → SessionProvider gọi /auth/refresh-token (dùng httpOnly cookie)
 *     → Thành công: setAuth() → isSessionReady = true → useFetchCart chạy
 *     → Thất bại: logout() + setSessionReady() → UI = chưa đăng nhập
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { accessToken, isHydrated, setAuth, logout, setSessionReady } =
    useAuthStore();

  // Đảm bảo chỉ thử refresh đúng 1 lần
  const hasTried = useRef(false);

  useEffect(() => {
    // Chờ Zustand load từ localStorage xong
    if (!isHydrated) return;

    // Case A: đã có token → không cần làm gì (isSessionReady đã true)
    if (accessToken) return;

    // Case B: không có token → thử refresh từ cookie
    if (hasTried.current) return;
    hasTried.current = true;

    const tryRefreshSession = async () => {
      try {
        const { accessToken: newToken, user } = await refreshSessionService();
        // setAuth tự set isSessionReady = true bên trong
        setAuth(newToken, {
          ...user,
          name: user.name || user.fullName || "",
        });
      } catch {
        logout();
        // Dù thất bại vẫn phải setSessionReady để unblock các fetch khác
        setSessionReady();
      }
    };

    tryRefreshSession();
  }, [isHydrated, accessToken, setAuth, logout, setSessionReady]);

  return <>{children}</>;
}

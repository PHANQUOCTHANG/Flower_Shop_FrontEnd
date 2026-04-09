"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { refreshSessionService } from "@/features/auth/services/authService";

// ─── SessionProvider ──────────────────────────────────────────────────────────
// Xử lý "cold start": khi user reload trang hoặc mở tab mới
// mà accessToken trong Zustand (localStorage) không có hoặc đã bị xóa,
// nhưng refreshToken cookie vẫn còn hạn → tự động làm mới session.
//
// Flow:
//   1. App mount → SessionProvider chạy (sau khi Zustand hydrate xong)
//   2. Nếu Zustand KHÔNG có accessToken → gọi POST /auth/refresh-token
//   3. Thành công → update Zustand: isAuthenticated = true, user, accessToken
//   4. Thất bại (cookie hết hạn/không hợp lệ) → logout() → UI = chưa đăng nhập
//
// Đối với mid-session (accessToken expire trong lúc dùng):
//   → Xử lý bởi axios.ts interceptor (401 → refresh → retry) ✅

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { accessToken, setAuth, logout, isHydrated } = useAuthStore();
  // Ref để đảm bảo chỉ thử refresh đúng 1 lần dù re-render
  const hasTried = useRef(false);

  useEffect(() => {
    // Chờ Zustand hydrate xong từ localStorage mới kiểm tra
    if (!isHydrated) return;

    // Đã có accessToken trong Zustand → không cần refresh cold start
    // Nếu sau này token hết hạn → axios interceptor (401) sẽ tự handle
    if (accessToken) return;

    // Chỉ thử 1 lần để tránh infinite loop
    if (hasTried.current) return;
    hasTried.current = true;

    const tryRefreshSession = async () => {
      try {
        // Backend đọc refreshToken từ cookie httpOnly, không cần gửi trong body
        const { accessToken: newToken, user } = await refreshSessionService();

        // Update Zustand với đầy đủ token + user info
        // Sau đây isAuthenticated = true, UI sẽ phản ánh đúng trạng thái đăng nhập
        setAuth(newToken, {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
        });
      } catch {
        // refreshToken hết hạn hoặc không hợp lệ → clear store
        // Middleware sẽ redirect về /login nếu user cố vào protected route
        logout();
      }
    };

    tryRefreshSession();
  }, [isHydrated, accessToken, setAuth, logout]);

  // Không block render — các component con tự kiểm tra isAuthenticated
  // để hiển thị nội dung phù hợp (skeleton, redirect, v.v.)
  return <>{children}</>;
}

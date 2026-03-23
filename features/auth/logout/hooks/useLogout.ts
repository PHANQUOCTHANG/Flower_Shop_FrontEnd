"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { logoutService, LogoutResponse } from "../services/logoutService";
import { useCartStore } from "@/stores/cart.store";

interface UseLogoutReturn {
  logout: () => Promise<LogoutResponse>;
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
}

/**
 * Custom hook để xử lý logout
 * - Gọi API logout
 * - Xóa auth store
 * - Redirect đến trang login
 */
export const useLogout = (role? : string | undefined): UseLogoutReturn => {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.logout);
  const clearCart = useCartStore((state) => state.clearCart);

  const logoutMutation = useMutation({
    mutationFn: logoutService,
    onSuccess: () => {
      // Clear auth store
      clearAuth();

      // Clear cart store
      clearCart();

      // Redirect đến trang login
      if (role && role === "CUSTOMER") router.push("/");
      else router.push("/admin/login");
    },
    onError: (error: Error) => {
      console.error("Logout failed:", error.message);
      // Vẫn clear store và redirect dù lỗi
      clearAuth();

      if (role === "CUSTOMER") router.push("/login");
      else router.push("/admin/login");
    },
  });

  return {
    logout: () => logoutMutation.mutateAsync(),
    isLoading: logoutMutation.isPending,
    error: logoutMutation.error,
    isSuccess: logoutMutation.isSuccess,
  };
};

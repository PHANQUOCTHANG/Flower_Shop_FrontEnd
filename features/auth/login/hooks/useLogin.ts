"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import {
  loginService,
  loginWithGoogleService,
  loginWithFacebookService,
} from "../services/loginService";
import { LoginPayload, LoginResponse } from "@/types/auth";
import { CART_QUERY_KEY } from "@/features/cart/hooks/useCart";

interface UseLoginReturn {
  login: (loginRequest: LoginPayload) => Promise<LoginResponse>;
  loginWithGoogle: (token: string) => Promise<LoginResponse>;
  loginWithFacebook: (token: string) => Promise<LoginResponse>;
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
}

/**
 * Custom hook để xử lý login
 * - Gọi API login
 * - Lưu token + user vào Zustand store
 * - Redirect đến trang home sau khi đăng nhập thành công
 */
export const useLogin = (): UseLoginReturn => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();

  const handleLoginSuccess = (data: LoginResponse) => {
    setAuth(data.accessToken, {
      ...data.user,
      name: data.user.name || data.user.fullName || "",
    });
    // Xóa cache cũ của cart để buộc refetch ngay khi MainLayout mount
    queryClient.removeQueries({ queryKey: CART_QUERY_KEY });
  };

  const loginMutation = useMutation({
    mutationFn: loginService,
    onSuccess: (data: LoginResponse) => {
      handleLoginSuccess(data);
      if (data.user.role === "ADMIN") return router.push("/admin/dashboard");
      router.push("/");
    },
    onError: (error: Error) => {
      // console.error("Login failed:", error.message);
    },
  });

  const loginWithGoogleMutation = useMutation({
    mutationFn: loginWithGoogleService,
    onSuccess: (data: LoginResponse) => {
      handleLoginSuccess(data);
      router.push("/");
    },
    onError: (error: Error) => {
      console.error("Google login failed:", error.message);
    },
  });

  const loginWithFacebookMutation = useMutation({
    mutationFn: loginWithFacebookService,
    onSuccess: (data: LoginResponse) => {
      handleLoginSuccess(data);
      router.push("/");
    },
    onError: (error: Error) => {
      console.error("Facebook login failed:", error.message);
    },
  });

  const isLoading =
    loginMutation.isPending ||
    loginWithGoogleMutation.isPending ||
    loginWithFacebookMutation.isPending;

  const error =
    loginMutation.error ||
    loginWithGoogleMutation.error ||
    loginWithFacebookMutation.error;

  const isSuccess =
    loginMutation.isSuccess ||
    loginWithGoogleMutation.isSuccess ||
    loginWithFacebookMutation.isSuccess;

  return {
    login: (loginRequest: LoginPayload) =>
      loginMutation.mutateAsync(loginRequest),
    loginWithGoogle: (token: string) =>
      loginWithGoogleMutation.mutateAsync(token),
    loginWithFacebook: (token: string) =>
      loginWithFacebookMutation.mutateAsync(token),
    isLoading,
    error: error || null,
    isSuccess,
  };
};

"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import {
  loginService,
  loginWithGoogleService,
  loginWithFacebookService,
} from "../services/loginService";
import { LoginPayload, LoginResponse } from "@/types/auth";

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

  const loginMutation = useMutation({
    mutationFn: loginService,
    onSuccess: (data: LoginResponse) => {
      // Lưu token + user vào store
      setAuth(data.accessToken, {
        id: data.user.id,
        email: data.user.email,
        name: data.user.fullName,
        role: data.user.role,
      });


      if (data.user.role === "ADMIN") return router.push("/admin/dashboard");

      // Redirect đến trang home
      router.push("/");
    },
    onError: (error: Error) => {
      // console.error("Login failed:", error.message);
    },
  });

  const loginWithGoogleMutation = useMutation({
    mutationFn: loginWithGoogleService,
    onSuccess: (data: LoginResponse) => {
      setAuth(data.accessToken, {
        id: data.user.id,
        email: data.user.email,
        name: data.user.fullName,
      });
      router.push("/");
    },
    onError: (error: Error) => {
      console.error("Google login failed:", error.message);
    },
  });

  const loginWithFacebookMutation = useMutation({
    mutationFn: loginWithFacebookService,
    onSuccess: (data: LoginResponse) => {
      setAuth(data.accessToken, {
        id: data.user.id,
        email: data.user.email,
        name: data.user.fullName,
      });
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";
import { ApiResponse } from "@/types/response";

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    avatar?: string;
    role?: string;
  };
}

// Gọi API login auth .
export const loginService = async (
  loginRequest: LoginPayload,
): Promise<LoginResponse> => {
  try {
    const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", {
      email: loginRequest.email,
      password: loginRequest.password,
    });

    if (response.data.status === "error") {
      throw new Error(response.data.message || "Đăng nhập thất bại");
    }

    return response.data.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Lỗi khi đăng nhập. Vui lòng thử lại.";
    throw new Error(message);
  }
};

// Gọi API để đăng nhập bằng Google
export const loginWithGoogleService = async (
  token: string,
): Promise<LoginResponse> => {
  try {
    const response = await api.post<ApiResponse<LoginResponse>>(
      "/auth/google",
      { token },
    );

    if (response.data.status === "error") {
      throw new Error(response.data.message || "Đăng nhập Google thất bại");
    }

    return response.data.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Lỗi khi đăng nhập Google. Vui lòng thử lại.";
    throw new Error(message);
  }
};

// Gọi API để đăng nhập bằng Facebook
export const loginWithFacebookService = async (
  token: string,
): Promise<LoginResponse> => {
  try {
    const response = await api.post<ApiResponse<LoginResponse>>(
      "/auth/facebook",
      { token },
    );

    if (response.data.status === "error") {
      throw new Error(response.data.message || "Đăng nhập Facebook thất bại");
    }

    return response.data.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Lỗi khi đăng nhập Facebook. Vui lòng thử lại.";
    throw new Error(message);
  }
};

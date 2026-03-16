import api from "@/lib/axios";
import { ApiResponse } from "@/types/response";

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  createdAt: string;
}

/**
 * Đăng ký tài khoản người dùng mới
 */
export const registerUser = async (
  payload: RegisterPayload,
): Promise<RegisterResponse> => {
  const response = await api.post<ApiResponse<RegisterResponse>>(
    "/auth/register",
    payload,
  );

  if (response.data.status === "error") {
    throw new Error(response.data.message || "Đăng ký thất bại");
  }

  return response.data.data;
};

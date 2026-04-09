import api from "@/lib/axios";
import { ApiResponse } from "@/types/response";

import { RegisterPayload, RegisterResponse } from "@/types/auth";

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

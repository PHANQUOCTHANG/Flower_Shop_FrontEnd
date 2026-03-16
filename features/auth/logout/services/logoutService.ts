import axios from "@/lib/axios";

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

/**
 * Gọi API logout
 * - Xóa token từ server
 */
export const logoutService = async (): Promise<LogoutResponse> => {
  const response = await axios.post<LogoutResponse>("/auth/logout");
  return response.data;
};

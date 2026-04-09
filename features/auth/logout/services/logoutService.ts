import axios from "@/lib/axios";

import { LogoutResponse } from "@/types/auth";

/**
 * Gọi API logout
 * - Xóa token từ server
 */
export const logoutService = async (): Promise<LogoutResponse> => {
  const response = await axios.post<LogoutResponse>("/auth/logout");
  return response.data;
};

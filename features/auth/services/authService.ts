/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";
import { ApiResponse } from "@/types/response";

// ─── Types ───────────────────────────────────────────────────────────────────

import { RefreshSessionResponse } from "@/types/auth";

// ─── Services ─────────────────────────────────────────────────────────────────

// Gọi API để lấy accessToken mới từ refreshToken cookie (httpOnly)
// Backend tự đọc refreshToken từ cookie, không cần gửi trong body
// Response: { accessToken, user } — đủ để update Zustand
export const refreshSessionService =
  async (): Promise<RefreshSessionResponse> => {
    const response =
      await api.post<ApiResponse<RefreshSessionResponse>>(
        "/auth/refresh-token",
      );
    return response.data.data;
  };

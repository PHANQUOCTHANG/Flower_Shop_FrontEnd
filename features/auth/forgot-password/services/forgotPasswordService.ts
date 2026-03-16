import api from "@/lib/axios";
import { ApiResponse } from "@/types/response";

// ── Request/Response Interfaces ────────────────────────────────────────────

export interface SendOtpRequest {
  email: string;
}

export interface SendOtpResponse {
  message: string;
  expiresIn?: number; // Thời gian hết hạn OTP (giây)
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
  token?: string; // Token tạm để dùng cho bước reset password
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
  email?: string;
}

// ── API Service Functions ────────────────────────────────────────────────────

/**
 * Gửi OTP đến email của người dùng
 */
export const sendOtp = async (
  request: SendOtpRequest,
): Promise<SendOtpResponse> => {
  try {
    const response = await api.post<ApiResponse<SendOtpResponse>>(
      "/auth/forgot-password/send-otp",
      request,
    );

    if (response.data.status === "error") {
      throw new Error(
        response.data.message || "Gửi mã OTP thất bại. Vui lòng thử lại.",
      );
    }

    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Lỗi gửi mã OTP");
  }
};

/**
 * Xác thực mã OTP
 */
export const verifyOtp = async (
  request: VerifyOtpRequest,
): Promise<VerifyOtpResponse> => {
  try {
    const response = await api.post<ApiResponse<VerifyOtpResponse>>(
      "/auth/forgot-password/verify-otp",
      request,
    );

    if (response.data.status === "error") {
      throw new Error(
        response.data.message || "Xác thực OTP thất bại. Vui lòng thử lại.",
      );
    }

    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Lỗi xác thực OTP");
  }
};

/**
 * Đặt lại mật khẩu
 */
export const resetPassword = async (
  request: ResetPasswordRequest,
): Promise<ResetPasswordResponse> => {
  try {
    const response = await api.post<ApiResponse<ResetPasswordResponse>>(
      "/auth/forgot-password/reset-password",
      request,
    );

    if (response.data.status === "error") {
      throw new Error(
        response.data.message ||
          "Cập nhật mật khẩu thất bại. Vui lòng thử lại.",
      );
    }

    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Lỗi cập nhật mật khẩu");
  }
};

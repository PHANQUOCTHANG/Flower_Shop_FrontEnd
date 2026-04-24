// Auth Types Chuẩn Hóa
// Dùng chung cho toàn bộ các chức năng liên quan đăng nhập, đăng ký, quên mật khẩu

import { User } from "@/stores/auth.store";

// ─── LOGIN ────────────────────────────────────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
  role: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

// ─── REGISTER ──────────────────────────────────────────────────────
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

// ─── SESSION & LOGOUT ──────────────────────────────────────────────
export interface RefreshSessionResponse {
  accessToken: string;
  user: User;
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

// ─── FORGOT PASSWORD ───────────────────────────────────────────────
export interface SendOtpRequest {
  email: string;
}

export interface SendOtpResponse {
  message: string;
  expiresIn?: number;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
  token?: string;
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

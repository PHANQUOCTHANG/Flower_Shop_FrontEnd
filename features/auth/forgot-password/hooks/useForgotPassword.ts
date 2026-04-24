import { useState, useRef, useEffect, useCallback } from "react";
import {
  sendOtp,
  verifyOtp,
  resetPassword,
} from "../services/forgotPasswordService";
import { useRouter } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────────────────

export type Step = "email" | "otp" | "reset" | "success";

export interface ForgotPasswordError {
  field?: string;
  message: string;
}

export interface UseForgotPasswordReturn {
  step: Step;
  email: string;
  otp: string[];
  newPassword: string;
  confirmPassword: string;
  showPassword: {
    newPassword: boolean;
    confirmPassword: boolean;
  };
  timer: number;
  isSubmitting: boolean;
  error: ForgotPasswordError | null;
  passwordStrength: {
    score: number;
    label: string;
    color: string;
  };

  setEmail: (email: string) => void;
  setOtp: (otp: string[]) => void;
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  toggleShowPassword: (field: "newPassword" | "confirmPassword") => void;
  clearError: () => void;
  resendOtp: () => Promise<void>;

  handleRequestOtp: (e: React.FormEvent) => Promise<void>;
  handleVerifyOtp: () => Promise<void>;
  handleResetPassword: (e: React.FormEvent) => Promise<void>;
  goBack: () => void;
}

// ── Validation Functions ───────────────────────────────────────────────────

const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return "Vui lòng nhập email";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Định dạng email không hợp lệ";
  }
  return null;
};

const validateOtp = (otp: string[]): string | null => {
  const otpString = otp.join("");
  if (otpString.length < 6) {
    return "Vui lòng nhập đầy đủ 6 chữ số";
  }
  if (!/^\d+$/.test(otpString)) {
    return "Mã OTP chỉ được chứa các chữ số";
  }
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Vui lòng nhập mật khẩu mới";
  }
  if (password.length < 8) {
    return "Mật khẩu phải có ít nhất 8 ký tự";
  }
  if (password.length > 255) {
    return "Mật khẩu quá dài";
  }
  return null;
};

const validatePasswordMatch = (
  password: string,
  confirmPassword: string,
): string | null => {
  if (!confirmPassword) {
    return "Vui lòng xác nhận mật khẩu";
  }
  if (password !== confirmPassword) {
    return "Mật khẩu xác nhận không khớp";
  }
  return null;
};

// ── Password Strength ──────────────────────────────────────────────────────

const getPasswordStrength = (password: string) => {
  if (!password) {
    return { score: 0, label: "Trống", color: "bg-slate-200" };
  }
  if (password.length < 6) {
    return { score: 30, label: "Yếu", color: "bg-red-500" };
  }
  if (password.length < 10) {
    return { score: 65, label: "Trung bình", color: "bg-amber-500" };
  }
  return { score: 100, label: "Mạnh", color: "bg-emerald-500" };
};

// ── Hook Implementation ────────────────────────────────────────────────────

export const useForgotPassword = (): UseForgotPasswordReturn => {
  // Trạng thái chính
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [timer, setTimer] = useState<number>(59);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<ForgotPasswordError | null>(null);
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  // Refs
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Tính toán độ mạnh mật khẩu
  const passwordStrength = getPasswordStrength(newPassword);

  // Đếm ngược timer OTP
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  // Toggle show password
  const toggleShowPassword = (field: "newPassword" | "confirmPassword") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Yêu cầu gửi OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const emailError = validateEmail(email);
    if (emailError) {
      setError({ field: "email", message: emailError });
      return;
    }

    setIsSubmitting(true);

    try {
      await sendOtp({
        email: email.toLowerCase().trim(),
      });

      // Chuyển sang bước OTP
      setOtp(new Array(6).fill(""));
      setTimer(59);
      setStep("otp");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gửi mã OTP thất bại";
      setError({ message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xác thực OTP
  const handleVerifyOtp = async () => {
    setError(null);

    // Validation
    const otpError = validateOtp(otp);
    if (otpError) {
      setError({ field: "otp", message: otpError });
      return;
    }

    setIsSubmitting(true);

    try {
      await verifyOtp({
        email: email.toLowerCase().trim(),
        otp: otp.join(""),
      });

      // Chuyển sang bước reset password
      setNewPassword("");
      setConfirmPassword("");
      setStep("reset");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Xác thực OTP thất bại";
      setError({ message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Đặt lại mật khẩu
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation mật khẩu mới
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError({ field: "newPassword", message: passwordError });
      return;
    }

    // Validation xác nhận mật khẩu
    const matchError = validatePasswordMatch(newPassword, confirmPassword);
    if (matchError) {
      setError({ field: "confirmPassword", message: matchError });
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword({
        email: email.toLowerCase().trim(),
        otp: otp.join(""),
        newPassword,
      });

      // Chuyển sang bước success
      setStep("success");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Cập nhật mật khẩu thất bại";
      setError({ message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gửi lại OTP
  const resendOtp = async () => {
    if (timer > 0) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await sendOtp({
        email: email.toLowerCase().trim(),
      });

      setTimer(59);
      setOtp(new Array(6).fill(""));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gửi lại mã OTP thất bại";
      setError({ message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quay lại bước trước
  const goBack = useCallback(() => {
    setError(null);
    if (step === "otp") {
      setOtp(new Array(6).fill(""));
      setStep("email");
    } else if (step === "reset") {
      setNewPassword("");
      setConfirmPassword("");
      setStep("otp");
    }
    else router.push("/login");
  }, [step]);

  return {
    step,
    email,
    otp,
    newPassword,
    confirmPassword,
    showPassword,
    timer,
    isSubmitting,
    error,
    passwordStrength,

    setEmail,
    setOtp,
    setNewPassword,
    setConfirmPassword,
    toggleShowPassword,
    clearError,
    resendOtp,

    handleRequestOtp,
    handleVerifyOtp,
    handleResetPassword,
    goBack,
  };
};

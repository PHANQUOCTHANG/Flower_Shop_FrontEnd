import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, RegisterPayload } from "../services/registerService";

export interface RegisterFormData {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterError {
  field?: string;
  message: string;
}

export interface UseRegisterReturn {
  form: RegisterFormData;
  isLoading: boolean;
  error: RegisterError | null;
  updateForm: (key: keyof RegisterFormData, value: string | boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  clearError: () => void;
}

/**
 * Hook quản lý logic đăng ký người dùng
 */
export const useRegister = (): UseRegisterReturn => {
  const router = useRouter();
  const [form, setForm] = useState<RegisterFormData>({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<RegisterError | null>(null);

  const updateForm = (key: keyof RegisterFormData, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    // Clear error khi người dùng thay đổi field
    if (error?.field === key) {
      setError(null);
    }
  };

  const validateForm = (): boolean => {
    // Check fullName
    if (!form.fullName.trim()) {
      setError({ field: "fullName", message: "Vui lòng nhập họ tên" });
      return false;
    }
    if (form.fullName.length < 2) {
      setError({ field: "fullName", message: "Họ tên quá ngắn" });
      return false;
    }
    if (form.fullName.length > 150) {
      setError({
        field: "fullName",
        message: "Họ tên không được vượt quá 150 ký tự",
      });
      return false;
    }

    // Check email
    if (!form.email.trim()) {
      setError({ field: "email", message: "Vui lòng nhập email" });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError({ field: "email", message: "Định dạng email không hợp lệ" });
      return false;
    }
    if (form.email.length > 150) {
      setError({
        field: "email",
        message: "Email không được vượt quá 150 ký tự",
      });
      return false;
    }

    // Check password
    if (!form.password) {
      setError({ field: "password", message: "Vui lòng nhập mật khẩu" });
      return false;
    }
    if (form.password.length < 8) {
      setError({
        field: "password",
        message: "Mật khẩu phải có ít nhất 8 ký tự",
      });
      return false;
    }
    if (form.password.length > 255) {
      setError({ field: "password", message: "Mật khẩu quá dài" });
      return false;
    }

    // Check confirmPassword
    if (!form.confirmPassword) {
      setError({
        field: "confirmPassword",
        message: "Vui lòng xác nhận mật khẩu",
      });
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError({
        field: "confirmPassword",
        message: "Mật khẩu xác nhận không khớp",
      });
      return false;
    }

    // Check phone (optional nhưng nếu nhập phải đúng định dạng)
    if (form.phone) {
      if (!/^[0-9]+$/.test(form.phone)) {
        setError({
          field: "phone",
          message: "Số điện thoại chỉ được chứa chữ số",
        });
        return false;
      }
      if (form.phone.length < 10) {
        setError({ field: "phone", message: "Số điện thoại không hợp lệ" });
        return false;
      }
      if (form.phone.length > 20) {
        setError({ field: "phone", message: "Số điện thoại quá dài" });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Tạo payload (không gửi confirmPassword và role)
      const payload: RegisterPayload = {
        fullName: form.fullName.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
        phone: form.phone ? form.phone.trim() : undefined,
      };

      // Gọi API đăng ký
      await registerUser(payload);

      // Redirect to login page sau 1 giây để người dùng thấy thông báo
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 10000);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Đăng ký thất bại, vui lòng thử lại";
      setError({ message: errorMessage });
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    form,
    isLoading,
    error,
    updateForm,
    handleSubmit,
    clearError,
  };
};

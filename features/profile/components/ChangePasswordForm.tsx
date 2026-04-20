"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import Alert from "@/components/ui/Alert";
import {
  useChangePassword,
  validateChangePassword,
  ChangePasswordFormData,
  ValidationErrors,
} from "@/features/profile/hooks/useChangePassword";
import { AxiosError } from "axios";

const INITIAL_FORM_DATA: ChangePasswordFormData = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const INITIAL_SHOW_PASSWORDS = {
  current: false,
  new: false,
  confirm: false,
};

const PASSWORD_TIPS = [
  "Chứa ít nhất 8 ký tự",
  "Có chữ cái hoa (A-Z)",
  "Có chữ cái thường (a-z)",
  "Có chữ số (0-9)",
];

const FIELD_TYPE_MAP: Record<string, "current" | "new" | "confirm"> = {
  currentPassword: "current",
  newPassword: "new",
  confirmPassword: "confirm",
};

interface PasswordInputProps {
  label: string;
  name: keyof ChangePasswordFormData;
  placeholder: string;
  error?: string[];
  value: string;
  isVisible: boolean;
  onToggleVisibility: (fieldType: "current" | "new" | "confirm") => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  name,
  placeholder,
  error,
  value,
  isVisible,
  onToggleVisibility,
  onChange,
}) => {
  const fieldType = FIELD_TYPE_MAP[name] as "current" | "new" | "confirm";

  return (
    <div className="space-y-2 sm:space-y-3">
      <label className="text-xs sm:text-sm font-bold text-slate-700 block">
        {label}
      </label>
      <div className="relative">
        <input
          type={isVisible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-3 sm:px-5 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border-2 transition-all outline-none font-medium text-sm ${
            error
              ? "border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
              : "border-slate-200 bg-slate-50 focus:border-[#ee2b5b] focus:ring-2 focus:ring-[#ee2b5b]/20"
          }`}
        />

        <button
          type="button"
          onClick={() => onToggleVisibility(fieldType)}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && error.length > 0 && (
        <p className="text-xs text-rose-600 font-medium">{error[0]}</p>
      )}
    </div>
  );
};

export const ChangePasswordForm: React.FC = () => {
  const [formData, setFormData] =
    useState<ChangePasswordFormData>(INITIAL_FORM_DATA);
  const [showPasswords, setShowPasswords] = useState(INITIAL_SHOW_PASSWORDS);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  const { mutate, isPending } = useChangePassword();

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[name as keyof ValidationErrors];
        return updated;
      });
    }

    if (errorMessage) {
      setErrorMessage("");
    }

    if (validationMessage) {
      setValidationMessage("");
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setShowPasswords(INITIAL_SHOW_PASSWORDS);
    setValidationErrors({});
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateChangePassword(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      const firstError =
        Object.values(errors)[0]?.[0] || "Vui lòng kiểm tra lại thông tin nhập";
      setValidationMessage(firstError);
      return;
    }

    setValidationErrors({});
    setValidationMessage("");
    setErrorMessage("");

    mutate(formData, {
      onSuccess: () => {
        setSuccessMessage("Mật khẩu đã được thay đổi thành công!");
        resetForm();
      },
      onError: (err: Error) => {
        let errorMsg = "Không thể thay đổi mật khẩu. Vui lòng thử lại.";

        if (err instanceof AxiosError) {
          errorMsg =
            (err?.response?.data as { message?: string })?.message ||
            err?.message ||
            errorMsg;
        } else {
          errorMsg = err?.message || errorMsg;
        }

        setErrorMessage(errorMsg);
      },
    });
  };

  return (
    <section className="bg-white rounded-2xl sm:rounded-[1.75rem] md:rounded-2xl lg:rounded-[2.5rem] p-6 sm:p-8 md:p-10 border border-slate-100 shadow-sm animate-in slide-in-from-right-10 duration-500">
      {/* Header */}
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10">
        <div className="size-12 sm:size-14 bg-slate-50 rounded-lg sm:rounded-2xl flex items-center justify-center text-[#ee2b5b] shrink-0">
          <Lock size={28} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 uppercase tracking-tight leading-tight">
            Đổi mật khẩu
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 sm:mt-1">
            Cập nhật mật khẩu của bạn để bảo mật tài khoản
          </p>
        </div>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-4 sm:mb-6">
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage("")}
          />
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-4 sm:mb-6">
          <Alert
            type="error"
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        </div>
      )}

      {/* Validation Error Alert */}
      {validationMessage && (
        <div className="mb-4 sm:mb-6">
          <Alert
            type="error"
            message={validationMessage}
            onClose={() => setValidationMessage("")}
          />
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-6 md:space-y-8"
      >
        <PasswordInput
          label="Mật khẩu hiện tại"
          name="currentPassword"
          placeholder="Nhập mật khẩu hiện tại"
          error={validationErrors.currentPassword}
          value={formData.currentPassword}
          isVisible={showPasswords.current}
          onToggleVisibility={togglePasswordVisibility}
          onChange={handleInputChange}
        />

        <div className="h-px bg-slate-100" />

        <PasswordInput
          label="Mật khẩu mới"
          name="newPassword"
          placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
          error={validationErrors.newPassword}
          value={formData.newPassword}
          isVisible={showPasswords.new}
          onToggleVisibility={togglePasswordVisibility}
          onChange={handleInputChange}
        />

        {/* Password Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
          <p className="text-[11px] sm:text-xs font-bold text-blue-900 mb-2 uppercase tracking-wide">
            💡 Gợi ý mật khẩu mạnh
          </p>
          <ul className="text-[11px] sm:text-xs text-blue-800 space-y-1 font-medium">
            {PASSWORD_TIPS.map((tip, i) => (
              <li key={i}>✓ {tip}</li>
            ))}
          </ul>
        </div>

        <PasswordInput
          label="Xác nhận mật khẩu mới"
          name="confirmPassword"
          placeholder="Nhập lại mật khẩu mới"
          error={validationErrors.confirmPassword}
          value={formData.confirmPassword}
          isVisible={showPasswords.confirm}
          onToggleVisibility={togglePasswordVisibility}
          onChange={handleInputChange}
        />

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 md:pt-8">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 sm:px-8 py-2.5 sm:py-4 border-2 border-slate-200 text-slate-700 font-black text-xs sm:text-sm uppercase tracking-wider rounded-lg sm:rounded-xl hover:bg-slate-50 transition-colors w-full sm:w-auto"
          >
            Xóa
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="flex-1 px-4 sm:px-8 py-2.5 sm:py-4 bg-[#ee2b5b] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-lg sm:rounded-xl shadow-lg shadow-[#ee2b5b]/20 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="hidden sm:inline">Đang xử lý...</span>
              </span>
            ) : (
              "Thay đổi mật khẩu"
            )}
          </button>
        </div>
      </form>

      {/* Security Footer */}
      <div className="mt-6 sm:mt-8 md:mt-10 pt-6 sm:pt-8 border-t border-slate-100">
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          <span className="font-bold text-slate-700">⚠️ Lưu ý bảo mật:</span>{" "}
          Hãy chọn mật khẩu mạnh mà chỉ bạn biết. Không chia sẻ mật khẩu với bất
          kỳ ai. Chúng tôi sẽ không bao giờ yêu cầu bạn cung cấp mật khẩu qua
          email hoặc điện thoại.
        </p>
      </div>
    </section>
  );
};

import React from "react";
import { ShieldCheck, KeyRound, Eye, EyeOff, Loader2 } from "lucide-react";

interface ResetPasswordStepProps {
  newPassword: string;
  confirmPassword: string;
  showPassword: {
    newPassword: boolean;
    confirmPassword: boolean;
  };
  isSubmitting: boolean;
  passwordStrength: {
    score: number;
    label: string;
    color: string;
  };
  onNewPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  onToggleShowPassword: (field: "newPassword" | "confirmPassword") => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function ResetPasswordStep({
  newPassword,
  confirmPassword,
  showPassword,
  isSubmitting,
  passwordStrength,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onToggleShowPassword,
  onSubmit,
}: ResetPasswordStepProps) {
  const isFormValid =
    !isSubmitting && newPassword === confirmPassword && newPassword.length >= 8;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="text-center mb-8">
        <div className="size-16 bg-[#ee2b5b]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={32} className="text-[#ee2b5b]" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2 leading-none">
          Mật khẩu mới
        </h1>
        <p className="text-slate-500 text-sm mt-2">
          Vui lòng thiết lập mật khẩu bảo mật cao.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Mật khẩu mới */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-400 ml-1 text-[10px]">
            Mật khẩu mới
          </label>
          <div className="relative group">
            <KeyRound
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type={showPassword.newPassword ? "text" : "password"}
              required
              disabled={isSubmitting}
              value={newPassword}
              onChange={(e) => onNewPasswordChange(e.target.value)}
              className="w-full h-14 pl-12 pr-12 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-transparent focus:border-[#ee2b5b] outline-none transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Tối thiểu 8 ký tự"
            />
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => onToggleShowPassword("newPassword")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ee2b5b] disabled:opacity-50"
            >
              {showPassword.newPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          {/* Thanh đo độ mạnh */}
          <div className="pt-2 px-1">
            <div className="flex justify-between items-center text-[10px] font-black uppercase mb-1">
              <span className="text-slate-400">Độ mạnh</span>
              <span
                className={
                  passwordStrength.score > 60
                    ? "text-emerald-500"
                    : "text-[#ee2b5b]"
                }
              >
                {passwordStrength.label}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${passwordStrength.color}`}
                style={{ width: `${passwordStrength.score}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Xác nhận mật khẩu */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-400 ml-1 text-[10px]">
            Xác nhận mật khẩu
          </label>
          <div className="relative group">
            <ShieldCheck
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type={showPassword.confirmPassword ? "text" : "password"}
              required
              disabled={isSubmitting}
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              className="w-full h-14 pl-12 pr-12 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-transparent focus:border-[#ee2b5b] outline-none transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Nhập lại mật khẩu"
            />
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => onToggleShowPassword("confirmPassword")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ee2b5b] disabled:opacity-50"
            >
              {showPassword.confirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full h-14 bg-[#ee2b5b] text-white font-black rounded-xl shadow-xl flex items-center justify-center active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "CẬP NHẬT MẬT KHẨU"
          )}
        </button>
      </form>
    </div>
  );
}

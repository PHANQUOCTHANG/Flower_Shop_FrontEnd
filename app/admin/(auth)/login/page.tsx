"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Fingerprint,
  HelpCircle,
  Settings,
  Flower2,
  ChevronRight,
} from "lucide-react";
import { useLogin } from "@/features/auth/login/hooks/useLogin";

// Định nghĩa kiểu dữ liệu cho thông tin đăng nhập
interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  // Trạng thái ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [successMessage, setSuccessMessage] = useState("");

  const { login, isLoading, error } = useLogin();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log({
        email: credentials.email,
        password: credentials.password,
        role: "ADMIN"
      })
      await login({
        email: credentials.email,
        password: credentials.password,
        role: "ADMIN"
      });
      setSuccessMessage("Đăng nhập thành công! Chuyển hướng...");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-['Inter',_sans-serif] flex items-center justify-center p-4 transition-colors duration-300">
      {/* Container chính của trang Login */}
      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-[#1a2235] shadow-2xl rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-700">
        {/* Cột trái: Hình ảnh & Giới thiệu (Ẩn trên mobile) */}
        <div className="hidden lg:flex relative bg-[#1152d4]/5 flex-col items-center justify-center p-16 overflow-hidden border-r border-slate-100 dark:border-slate-800">
          {/* Hiệu ứng chấm nền (Radial Gradient) */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, #1152d4 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          ></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="size-64 bg-white dark:bg-[#242f47] rounded-full flex items-center justify-center shadow-2xl border-8 border-[#1152d4]/10 mb-10 overflow-hidden group">
              <img
                alt="Flower arrangement"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                src="https://images.unsplash.com/photo-1548013146-72479768bbaa?w=600&q=80"
              />
            </div>

            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter uppercase leading-none">
              Flower Shop <span className="text-[#1152d4]">CMS</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed font-medium">
              Hệ thống quản lý cửa hàng chuyên nghiệp. Theo dõi đơn hàng và báo
              cáo doanh thu thời gian thực.
            </p>

            {/* Badges bảo mật */}
            <div className="mt-12 flex gap-4">
              <div className="px-5 py-2.5 bg-white dark:bg-[#242f47] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-2 hover:translate-y-[-2px] transition-transform">
                <ShieldCheck size={18} className="text-[#1152d4]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
                  Bảo mật SSL
                </span>
              </div>
              <div className="px-5 py-2.5 bg-white dark:bg-[#242f47] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-2 hover:translate-y-[-2px] transition-transform">
                <Fingerprint size={18} className="text-[#1152d4]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
                  Mã hóa AES
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Form đăng nhập */}
        <div className="flex flex-col justify-center px-8 py-16 md:px-16 lg:px-20">
          {/* Logo Brand nhỏ */}
          <div className="mb-12 flex items-center gap-3 animate-in slide-in-from-top-4 duration-700">
            <div className="p-2.5 bg-[#1152d4] rounded-2xl text-white shadow-lg shadow-[#1152d4]/30">
              <Flower2 size={24} />
            </div>
            <h2 className="text-xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
              Admin Portal
            </h2>
          </div>

          <div className="mb-10">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight leading-none">
              Đăng nhập
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Chào mừng trở lại! Vui lòng nhập thông tin quản trị.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl">
              <p className="text-sm font-bold text-red-600 dark:text-red-400">
                {error.message || "Đăng nhập thất bại. Vui lòng thử lại."}
              </p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-2xl">
              <p className="text-sm font-bold text-green-600 dark:text-green-400">
                {successMessage}
              </p>
            </div>
          )}

          {/* Form đăng nhập chính */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Trường Email */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1152d4] transition-colors">
                  <User size={20} />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  disabled={isLoading}
                  value={credentials.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-[#101622]/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-[#1152d4]/10 focus:border-[#1152d4] outline-none transition-all text-slate-900 dark:text-white font-bold placeholder:text-slate-400 shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="admin@flowershop.vn"
                />
              </div>
            </div>

            {/* Trường Mật khẩu */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400">
                  Mật khẩu
                </label>
                <a
                  className="text-xs font-bold text-[#1152d4] hover:underline transition-all"
                  href="#"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1152d4] transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isLoading}
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-[#101622]/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-[#1152d4]/10 focus:border-[#1152d4] outline-none transition-all text-slate-900 dark:text-white font-bold placeholder:text-slate-400 shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#1152d4] transition-colors outline-none focus:text-[#1152d4]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center px-1">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                checked={credentials.rememberMe}
                onChange={handleInputChange}
                className="h-5 w-5 rounded-lg border-slate-300 text-[#1152d4] focus:ring-[#1152d4] cursor-pointer transition-all"
              />
              <label
                className="ml-3 block text-sm font-bold text-slate-500 dark:text-slate-400 cursor-pointer select-none"
                htmlFor="remember-me"
              >
                Duy trì đăng nhập
              </label>
            </div>

            {/* Nút đăng nhập */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#1152d4] hover:bg-[#1152d4]/90 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-xl shadow-[#1152d4]/20 transition-all active:scale-[0.98] uppercase tracking-widest text-sm flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Đang xác nhận...</span>
                </>
              ) : (
                <>
                  <span>Xác nhận đăng nhập</span>
                  <ChevronRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          {/* Footer chân trang */}
          <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-[0.2em]">
              © 2024 FlowerShop CMS
            </span>
            <div className="flex gap-4">
              <button
                className="text-slate-400 hover:text-[#1152d4] transition-colors"
                title="Trợ giúp"
              >
                <HelpCircle size={20} />
              </button>
              <button
                className="text-slate-400 hover:text-[#1152d4] transition-colors"
                title="Cài đặt"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

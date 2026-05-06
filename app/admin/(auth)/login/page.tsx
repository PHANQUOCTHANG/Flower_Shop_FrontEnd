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
        role: "ADMIN",
        rememberMe: credentials.rememberMe,
      });
      await login({
        email: credentials.email,
        password: credentials.password,
        role: "ADMIN",
        rememberMe: credentials.rememberMe,
      });
      setSuccessMessage("Đăng nhập thành công! Chuyển hướng...");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-300 font-sans flex items-center justify-center p-4 selection:bg-[#1152d4]/40 selection:text-white relative overflow-hidden">
      {/* ── Background Effects ── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#1152d4]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      </div>

      {/* ── Main Container ── */}
      <div className="relative z-10 w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-5 bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-700">
        
        {/* ── Left Column: Intro ── */}
        <div className="hidden md:flex md:col-span-2 relative p-10 flex-col justify-between border-r border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div>
            <div className="inline-flex items-center justify-center p-2.5 bg-[#1152d4]/20 border border-[#1152d4]/30 rounded-xl text-[#3b82f6] shadow-[0_0_20px_rgba(17,82,212,0.3)] mb-8">
              <Flower2 size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Flower Shop OS</h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Hệ thống quản trị trung tâm. Quản lý đơn hàng, theo dõi doanh thu và cấu hình cửa hàng theo thời gian thực.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs font-medium text-slate-400 bg-white/5 p-3 rounded-xl border border-white/5">
              <ShieldCheck size={18} className="text-[#3b82f6]" />
              <span>Kết nối mã hóa an toàn</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-400 bg-white/5 p-3 rounded-xl border border-white/5">
              <Fingerprint size={18} className="text-[#3b82f6]" />
              <span>Xác thực đa lớp</span>
            </div>
          </div>
        </div>

        {/* ── Right Column: Form ── */}
        <div className="md:col-span-3 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-[#0a0a0a]/50">
          <div className="md:hidden flex items-center gap-2 text-white mb-8">
            <div className="p-2 bg-[#1152d4]/20 border border-[#1152d4]/30 rounded-lg text-[#3b82f6]">
              <Flower2 size={20} />
            </div>
            <span className="text-lg font-bold tracking-tight">Flower Shop OS</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Đăng nhập hệ thống</h2>
            <p className="text-sm text-slate-400">
              Vui lòng cung cấp thông tin xác thực quản trị viên.
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-in slide-in-from-top-2">
              <p className="text-sm font-medium text-red-400">{error.message || "Xác thực thất bại. Vui lòng thử lại."}</p>
            </div>
          )}
          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-in slide-in-from-top-2">
              <p className="text-sm font-medium text-emerald-400">{successMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Email quản trị</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#3b82f6] transition-colors">
                  <User size={18} />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  disabled={isLoading}
                  value={credentials.email}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#1152d4]/50 focus:border-[#3b82f6] outline-none transition-all text-white placeholder:text-slate-600 disabled:opacity-50 text-sm shadow-inner"
                  placeholder="admin@flowershop.vn"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Mật khẩu</label>
                <a className="text-xs font-medium text-[#3b82f6] hover:text-[#60a5fa] transition-colors" href="#">
                  Cần hỗ trợ?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#3b82f6] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isLoading}
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-11 py-3.5 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#1152d4]/50 focus:border-[#3b82f6] outline-none transition-all text-white placeholder:text-slate-600 disabled:opacity-50 text-sm shadow-inner"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-3 cursor-pointer group w-max pt-1">
              <div className="relative flex items-center justify-center">
                <input
                  name="rememberMe"
                  type="checkbox"
                  checked={credentials.rememberMe}
                  onChange={handleInputChange}
                  className="peer appearance-none h-4 w-4 rounded border border-slate-600 bg-black/40 checked:border-[#3b82f6] checked:bg-[#3b82f6] transition-colors cursor-pointer"
                />
                <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Duy trì phiên đăng nhập</span>
            </label>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full overflow-hidden group bg-[#1152d4] hover:bg-[#0f46b8] disabled:bg-[#1152d4]/50 text-white font-bold py-3.5 rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] shadow-[0_0_20px_rgba(17,82,212,0.4)]"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                    <span className="text-sm tracking-wide">Đang xác thực...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm tracking-wide">TRUY CẬP HỆ THỐNG</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-12 text-center">
            <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">
              © 2024 FlowerShop OS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

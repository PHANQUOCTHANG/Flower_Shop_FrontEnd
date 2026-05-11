"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LayoutDashboard,
  ShieldCheck,
  Key,
  HelpCircle,
  Settings,
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
    <div className="min-h-screen bg-[#6366F1]/10 flex items-center justify-center p-4 md:p-8">
      {/* ── Main Container ── */}
      <div className="w-full max-w-[1000px] flex flex-col md:flex-row bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden min-h-[600px]">
        
        {/* ── Left Column: Intro (Visible on MD+) ── */}
        <div className="hidden md:flex w-[45%] bg-[#F1F5F9] flex-col items-center justify-center p-12 text-center border-r border-gray-100 relative">
          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-blue-200" />
          <div className="absolute bottom-20 right-10 w-3 h-3 rounded-full bg-blue-100" />
          
          {/* Circle Image Container */}
          <div className="relative mb-10">
            <div className="w-64 h-64 rounded-full overflow-hidden border-8 border-white shadow-xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop" 
                alt="Flower Shop CMS" 
                className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl z-0" />
          </div>

          <h1 className="text-3xl font-extrabold text-[#1E293B] mb-4 tracking-tight">Flower Shop CMS</h1>
          <p className="text-[#64748B] text-sm leading-relaxed max-w-[280px]">
            Hệ thống quản lý cửa hàng hoa chuyên nghiệp. Theo dõi đơn hàng, quản lý kho và báo cáo doanh thu thời gian thực.
          </p>

          {/* Badges */}
          <div className="mt-12 flex gap-3">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Bảo mật SSL</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
              <Key className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Mã hóa AES-256</span>
            </div>
          </div>
        </div>

        {/* ── Right Column: Form ── */}
        <div className="flex-1 p-8 md:p-14 lg:p-20 flex flex-col justify-between">
          <div>
            {/* Header: Admin Portal */}
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-700 tracking-tight">Admin Portal</span>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Quản trị hệ thống</h2>
              <p className="text-sm text-gray-400">
                Vui lòng đăng nhập để tiếp tục quản lý cửa hàng
              </p>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-xs font-semibold text-red-600">{error.message || "Xác thực thất bại. Vui lòng thử lại."}</p>
              </div>
            )}
            {successMessage && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <p className="text-xs font-semibold text-emerald-600">{successMessage}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-gray-600">Email/Tên đăng nhập</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    disabled={isLoading}
                    value={credentials.email}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm text-gray-800 placeholder:text-gray-300 disabled:opacity-50"
                    placeholder="admin@flowershop.vn"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[13px] font-bold text-gray-600">Mật khẩu</label>
                  <a className="text-[12px] font-bold text-blue-600 hover:text-blue-700 transition-colors" href="#">
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={isLoading}
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-11 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm text-gray-800 placeholder:text-gray-300 disabled:opacity-50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-gray-500 transition-colors outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-3 cursor-pointer group w-max">
                <input
                  name="rememberMe"
                  type="checkbox"
                  checked={credentials.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-gray-200 text-blue-600 focus:ring-blue-100 transition-all cursor-pointer"
                />
                <span className="text-[13px] font-medium text-gray-500 group-hover:text-gray-700 transition-colors">Duy trì đăng nhập</span>
              </label>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/25 active:scale-[0.98] text-sm tracking-wide"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                      <span>ĐANG XỬ LÝ...</span>
                    </div>
                  ) : (
                    "ĐĂNG NHẬP"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-12 flex items-center justify-between border-t border-gray-50 pt-6">
            <span className="text-[11px] text-gray-400 font-bold tracking-widest uppercase">
              © 2024 FLOWERSHOP CMS
            </span>
            <div className="flex gap-4">
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <HelpCircle size={18} />
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

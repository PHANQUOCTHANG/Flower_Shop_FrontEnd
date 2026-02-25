"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Flower2 } from "lucide-react";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: gọi API đăng nhập ở đây
    console.log({ identifier, password, rememberMe });
  };

  return (
    <div className="flex min-h-screen w-full bg-[#fcfbf9] dark:bg-[#1a0f12] text-[#1b0d11] dark:text-white transition-colors duration-300 font-sans antialiased">
      {/* ───────── Cột trái – ảnh nền ───────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#ee2b5b]/10 mix-blend-multiply z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB5PyS2hfFIEL2wy78OZHdA9O_pW2V9cocTtlOK7-ijMMbDrukiOHmmnAOEMVnZOUKKl72ecQRy3gFTXZtwZqPHt-hWYJUJfu411isxQ1Ys318d9uBV6UijI38ZdXh-aC21hbS6VllPp731slsZSjD400YTX5ylIXoFAj2CMx4N8HjxI4Pdgdc-Zuw1TMoehEbNyM87uRCMxKBtrPLd3-NrEi55Vqow0FiyPjqfUbNoYi-3hJPUkT_dlcshkTzznrQoXh3i3MMI-BsO')",
          }}
        />
        <div className="relative z-20 flex flex-col justify-end p-20 text-white w-full h-full bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center gap-3 mb-6">
            <Flower2 size={40} />
            <h1 className="text-3xl font-bold tracking-tight">Flower Shop</h1>
          </div>
          <h2 className="text-5xl font-extrabold leading-tight mb-4">
            Trao gửi yêu thương qua từng cánh hoa
          </h2>
          <p className="text-lg text-slate-200 max-w-md">
            Khám phá bộ sưu tập hoa tươi nghệ thuật được thiết kế riêng cho mọi
            khoảnh khắc đáng nhớ của bạn.
          </p>
        </div>
      </div>

      {/* ───────── Cột phải – form ───────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 md:p-24 bg-white dark:bg-white/5">
        <div className="w-full max-w-[440px]">
          {/* Tiêu đề */}
          <div className="mb-10 text-center lg:text-left">
            {/* Logo hiện trên mobile */}
            <div className="lg:hidden flex justify-center mb-6">
              <div className="flex items-center gap-2 text-[#ee2b5b]">
                <Flower2 size={32} />
                <span className="text-xl font-bold tracking-tight">
                  Flower Shop
                </span>
              </div>
            </div>
            <h2 className="text-3xl font-black text-[#1b0d11] dark:text-white tracking-tight mb-3 uppercase">
              Đăng Nhập
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Chào mừng bạn quay trở lại với cửa hàng hoa tươi.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email / SĐT */}
            <div>
              <label className="block text-sm font-semibold text-[#1b0d11] dark:text-white mb-2">
                Email hoặc Số điện thoại
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Nhập email hoặc số điện thoại"
                required
                className="w-full px-4 py-3.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-[#1b0d11] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500
                           focus:ring-2 focus:ring-[#ee2b5b]/20 focus:border-[#ee2b5b] outline-none transition-all"
              />
            </div>

            {/* Mật khẩu */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-[#1b0d11] dark:text-white">
                  Mật khẩu
                </label>
                <a
                  href="#"
                  className="text-xs font-semibold text-[#ee2b5b] hover:underline"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                  className="w-full px-4 py-3.5 pr-12 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-[#1b0d11] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500
                             focus:ring-2 focus:ring-[#ee2b5b]/20 focus:border-[#ee2b5b] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-[#ee2b5b] transition-colors"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Ghi nhớ */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 dark:border-white/20 accent-[#ee2b5b] cursor-pointer"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Ghi nhớ đăng nhập
              </span>
            </label>

            {/* Nút submit */}
            <button
              type="submit"
              className="w-full bg-[#ee2b5b] hover:bg-[#d9244f] active:scale-[0.98]
                         text-white font-bold py-4 rounded-lg shadow-lg shadow-[#ee2b5b]/25
                         transition-all text-sm uppercase tracking-wider"
            >
              Đăng Nhập
            </button>
          </form>

          {/* Đăng nhập mạng xã hội */}
          <div className="mt-10">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400">
                  Hoặc tiếp tục với
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 dark:border-white/10
                                 rounded-lg bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
              >
                <GoogleIcon />
                <span className="text-sm font-semibold text-[#1b0d11] dark:text-white">
                  Google
                </span>
              </button>
              <button
                className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 dark:border-white/10
                                 rounded-lg bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
              >
                <FacebookIcon />
                <span className="text-sm font-semibold text-[#1b0d11] dark:text-white">
                  Facebook
                </span>
              </button>
            </div>
          </div>

          {/* Chuyển sang đăng ký */}
          <p className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
            Bạn chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="font-bold text-[#ee2b5b] hover:underline ml-1"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

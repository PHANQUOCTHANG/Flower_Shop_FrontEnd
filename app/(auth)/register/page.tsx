"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  User,
  Phone,
  Mail,
  Lock,
  Flower2,
  ArrowRight,
} from "lucide-react";

// ── Reusable Input field with left icon ──────────────────────────────────────
interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  icon: React.ReactNode;
  rightSlot?: React.ReactNode;
}

function Field({
  label,
  id,
  icon,
  rightSlot,
  className = "",
  ...rest
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-[#1b0d11] dark:text-white mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 select-none pointer-events-none">
          {icon}
        </div>
        <input
          id={id}
          className={`w-full pl-10 ${rightSlot ? "pr-12" : "pr-4"} py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg
                      text-[#1b0d11] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500
                      focus:ring-2 focus:ring-[#ee2b5b] focus:border-[#ee2b5b] outline-none transition-all ${className}`}
          {...rest}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    marketing: false,
  });
  const [showPass, setShowPass] = useState(false);

  const set =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({
        ...form,
        [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
      });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    // TODO: gọi API đăng ký
    console.log(form);
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#fcfbf9] dark:bg-[#1a0f12] text-[#1b0d11] dark:text-white transition-colors duration-300 font-sans antialiased">
      {/* ── Cột trái: ảnh nền (ẩn trên mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAlXxavdMIJRvU-B2Kxw7LUyDh_01f_yPiFmZcHADd7Q0mhOqSo63kdOkbgRf2TNCKT-ZSL572OL9XeF80dBfz_R8XKfhHizc8dFPnqHZ9FeG1cxliNy6ofJ12x043Cn-EAf_w5OF82V8Oqngyyfv4VAJMbzVArsH9q6IZzExZEWwY_K5_3qNBrJTfilFPfMTghkySoI7mpF24yn_SrraKPF-SAd8XBK_ZoVuMaLcdYw3uan-NJGgIS2ulQjbh7a6iFwny3OuvXH_GL')",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(rgba(34,16,21,.2), rgba(34,16,21,.45))",
          }}
        />
        <div className="relative z-10 p-12 text-white max-w-xl">
          <div className="flex items-center gap-3 mb-8">
            <Flower2 size={40} />
            <h1 className="text-3xl font-bold tracking-tight">Flower Shop</h1>
          </div>
          <h2 className="text-5xl font-black leading-tight mb-6">
            Mang hương sắc thiên nhiên vào không gian của bạn
          </h2>
          <p className="text-lg opacity-90 leading-relaxed">
            Đăng ký thành viên ngay hôm nay để nhận ưu đãi 15% cho đơn hàng đầu
            tiên và cập nhật những mẫu hoa mới nhất theo mùa.
          </p>
        </div>
      </div>

      {/* ── Cột phải: form ── */}
      <div className="flex flex-1 flex-col justify-center bg-white dark:bg-white/5 px-6 py-12 sm:px-12 lg:w-1/2 xl:w-2/5 shadow-2xl z-10">
        <div className="mx-auto w-full max-w-md">
          {/* Logo mobile */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8 text-[#ee2b5b]">
            <Flower2 size={32} />
            <span className="text-xl font-bold">Flower Shop</span>
          </div>

          {/* Tiêu đề */}
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-[#1b0d11] dark:text-white tracking-tight mb-2">
              Tạo Tài Khoản
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Tham gia cùng chúng tôi để bắt đầu trải nghiệm mua sắm tuyệt vời.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Field
              label="Họ và tên"
              id="fullName"
              icon={<User size={20} />}
              type="text"
              placeholder="Nguyễn Văn A"
              required
              value={form.fullName}
              onChange={set("fullName")}
            />

            <Field
              label="Số điện thoại"
              id="phone"
              icon={<Phone size={20} />}
              type="tel"
              placeholder="0901 234 567"
              required
              value={form.phone}
              onChange={set("phone")}
            />

            <Field
              label="Email"
              id="email"
              icon={<Mail size={20} />}
              type="email"
              placeholder="name@example.com"
              required
              value={form.email}
              onChange={set("email")}
            />

            <Field
              label="Mật khẩu"
              id="password"
              icon={<Lock size={20} />}
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              required
              value={form.password}
              onChange={set("password")}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-gray-400 dark:text-gray-500 hover:text-[#ee2b5b] transition-colors"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />

            <Field
              label="Xác nhận mật khẩu"
              id="confirmPassword"
              icon={<Lock size={20} />}
              type="password"
              placeholder="••••••••"
              required
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
            />

            {/* Checkbox marketing */}
            <label className="flex items-start gap-3 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.marketing}
                onChange={set("marketing")}
                className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 dark:border-white/20 accent-[#ee2b5b] cursor-pointer"
              />
              <div>
                <p className="text-sm font-medium text-[#1b0d11] dark:text-white">
                  Nhận thông báo khuyến mãi qua Email
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  Chúng tôi sẽ chỉ gửi những thông tin hữu ích nhất cho bạn.
                </p>
              </div>
            </label>

            {/* Submit */}
            <div className="pt-3">
              <button
                type="submit"
                className="group flex w-full justify-center items-center gap-2 rounded-lg
                           bg-[#ee2b5b] hover:bg-[#d9244f] active:scale-[0.98]
                           px-4 py-4 text-sm font-bold text-white
                           shadow-lg shadow-[#ee2b5b]/25 transition-all
                           focus:outline-none focus:ring-2 focus:ring-[#ee2b5b] focus:ring-offset-2"
              >
                ĐĂNG KÝ NGAY
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </form>

          {/* Chuyển sang đăng nhập */}
          <div className="mt-10 text-center border-t border-gray-200 dark:border-white/10 pt-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="font-bold text-[#ee2b5b] hover:underline ml-1"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          <p className="mt-10 text-center text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium">
            © 2024 Flower Shop. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

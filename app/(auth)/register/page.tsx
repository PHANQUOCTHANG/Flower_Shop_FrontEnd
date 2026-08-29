"use client";

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
  ArrowLeft,
} from "lucide-react";
import { useRegister } from "@/features/auth/register/hooks/useRegister";
import Alert from "@/components/ui/Alert";
import { useState } from "react";

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
        className="block text-sm font-semibold text-[#1b0d11] mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 select-none pointer-events-none">
          {icon}
        </div>
        <input
          id={id}
          className={`w-full pl-10 ${rightSlot ? "pr-12" : "pr-4"} py-3 bg-white border border-gray-200 rounded-lg
 text-[#1b0d11] placeholder:text-gray-400 
 focus:ring-2 focus:ring-[#EE2B5B] focus:border-[#EE2B5B] outline-none transition-all
 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
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
  const { form, isLoading, error, updateForm, handleSubmit, handleVerifyOtp, step, setStep } = useRegister();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleOtpChange = (index: number, value: string) => {
    // Chỉ lấy ký tự số cuối cùng (nếu gõ đè)
    const digit = value.replace(/\D/g, "").slice(-1);
    
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Tự động focus sang ô tiếp theo
    if (digit && index < 5) {
      setTimeout(() => {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }, 10);
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;
    
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    // Focus ô cuối cùng được dán
    const focusIndex = Math.min(pastedData.length, 5);
    setTimeout(() => {
      const nextInput = document.getElementById(`otp-${focusIndex === 6 ? 5 : focusIndex}`);
      nextInput?.focus();
    }, 10);
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Quay lại ô trước đó nếu nhấn Backspace trên ô trống
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const submitOtp = () => {
    handleVerifyOtp(otp.join(""));
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] font-sans text-[#1b0d11] flex items-center justify-center p-4 sm:p-8 transition-colors duration-300 selection:bg-[#EE2B5B]/20 selection:text-[#EE2B5B]">
      
      {/* ── Main Container (Central Card) ── */}
      <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-white shadow-[0_20px_50px_-12px_rgba(238,43,91,0.1)] rounded-[2rem] overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-700">
        
        {/* ── Left Column: Image (Hidden on Mobile) ── */}
        <div className="hidden lg:flex relative bg-black/5 flex-col items-center justify-center overflow-hidden">
          {/* Lớp phủ & Hình nền */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
          <div className="absolute inset-0 bg-[#EE2B5B]/10 mix-blend-multiply z-10" />
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-110"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=1887&auto=format&fit=crop')",
            }}
          />
          
          <div className="relative z-20 flex flex-col justify-end p-12 text-white w-full h-full text-center">
            <div className="flex justify-center items-center gap-2 mb-4 opacity-90">
              <Flower2 size={32} className="text-[#ffb3c6]" />
            </div>
            <h2 
              className="text-[2.75rem] font-bold leading-[1.1] mb-4 tracking-tight text-white"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Hương sắc thiên nhiên <br />
              <span className="text-[#ffb3c6] italic font-medium">trong không gian của bạn</span>
            </h2>
            <p className="text-white/80 max-w-[300px] mx-auto font-light leading-relaxed">
              Đăng ký thành viên ngay hôm nay để nhận ưu đãi 15% cho đơn hàng đầu tiên.
            </p>
          </div>
        </div>

        {/* ── Right Column: Form ── */}
        <div className="p-8 sm:p-12 flex flex-col justify-center relative bg-white overflow-y-auto max-h-[90vh]">
          {/* Nút quay lại */}
          <Link
            href="/"
            className="group absolute top-8 left-8 inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#EE2B5B] transition-colors"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Trang chủ</span>
          </Link>

          <div className="mt-8 lg:mt-0 mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Logo Mobile */}
            <div className="lg:hidden flex justify-center items-center gap-2 text-[#EE2B5B] mb-6">
              <Flower2 size={28} />
              <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Flower Shop
              </span>
            </div>

            <h2 
              className="text-3xl font-bold text-[#1b0d11] tracking-tight mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Tạo Tài Khoản
            </h2>
            <p className="text-gray-500 font-medium text-sm">
              Tham gia cùng chúng tôi để bắt đầu trải nghiệm mua sắm.
            </p>
          </div>

          {/* Error Alert */}
          {error && showAlert && (
            <div className="mb-6 animate-in fade-in zoom-in-95 duration-300">
              <Alert 
                type={step === 2 && error.message.includes("kiểm tra email") ? "success" : "error"} 
                message={error.message} 
                autoClose 
                duration={10000} 
                onClose={() => setShowAlert(false)} 
              />
            </div>
          )}

          {/* Form */}
          {step === 1 ? (
          <form
            className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150"
            onSubmit={(e) => {
              setShowAlert(true);
              handleSubmit(e);
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Họ và tên"
                id="fullName"
                icon={<User size={16} />}
                type="text"
                placeholder="Nguyễn Văn A"
                required
                disabled={isLoading}
                value={form.fullName}
                onChange={(e) => updateForm("fullName", e.target.value)}
                className="bg-gray-50/50 rounded-xl focus:bg-white border-2 border-gray-100 shadow-sm font-medium py-3 text-sm focus:ring-[#EE2B5B]/10 focus:border-[#EE2B5B]"
              />
              <Field
                label="Số điện thoại"
                id="phone"
                icon={<Phone size={16} />}
                type="tel"
                placeholder="0901 234 567"
                disabled={isLoading}
                value={form.phone}
                onChange={(e) => updateForm("phone", e.target.value)}
                className="bg-gray-50/50 rounded-xl focus:bg-white border-2 border-gray-100 shadow-sm font-medium py-3 text-sm focus:ring-[#EE2B5B]/10 focus:border-[#EE2B5B]"
              />
            </div>

            <Field
              label="Email"
              id="email"
              icon={<Mail size={16} />}
              type="email"
              placeholder="name@example.com"
              required
              disabled={isLoading}
              value={form.email}
              onChange={(e) => updateForm("email", e.target.value)}
              className="bg-gray-50/50 rounded-xl focus:bg-white border-2 border-gray-100 shadow-sm font-medium py-3 text-sm focus:ring-[#EE2B5B]/10 focus:border-[#EE2B5B]"
            />

            <Field
              label="Mật khẩu"
              id="password"
              icon={<Lock size={16} />}
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              required
              disabled={isLoading}
              value={form.password}
              onChange={(e) => updateForm("password", e.target.value)}
              className="bg-gray-50/50 rounded-xl focus:bg-white border-2 border-gray-100 shadow-sm font-medium py-3 text-sm focus:ring-[#EE2B5B]/10 focus:border-[#EE2B5B]"
              rightSlot={
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowPass(!showPass)}
                  className="text-gray-400 hover:text-[#EE2B5B] transition-colors disabled:opacity-50"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            <Field
              label="Xác nhận mật khẩu"
              id="confirmPassword"
              icon={<Lock size={16} />}
              type={showConfirmPass ? "text" : "password"}
              placeholder="••••••••"
              required
              disabled={isLoading}
              value={form.confirmPassword}
              onChange={(e) => updateForm("confirmPassword", e.target.value)}
              className="bg-gray-50/50 rounded-xl focus:bg-white border-2 border-gray-100 shadow-sm font-medium py-3 text-sm focus:ring-[#EE2B5B]/10 focus:border-[#EE2B5B]"
              rightSlot={
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="text-gray-400 hover:text-[#EE2B5B] transition-colors disabled:opacity-50"
                >
                  {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full overflow-hidden group bg-[#EE2B5B] hover:bg-[#d41e4a] disabled:bg-[#EE2B5B]/50 text-white font-bold py-3.5 rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-[#EE2B5B]/25"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                {isLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span className="tracking-wide text-sm">ĐANG XỬ LÝ...</span>
                  </>
                ) : (
                  <>
                    <span className="tracking-wide text-sm">ĐĂNG KÝ THÀNH VIÊN</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EE2B5B]/10 text-[#EE2B5B] mb-4">
                  <Mail size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#1b0d11]">Xác thực Email</h3>
                <p className="text-gray-500 text-sm mt-2">
                  Chúng tôi đã gửi mã xác thực gồm 6 số đến <br />
                  <span className="font-semibold text-[#EE2B5B]">{form.email}</span>
                </p>
              </div>

              <div className="flex justify-center gap-2 sm:gap-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="tel"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    disabled={isLoading}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#EE2B5B] focus:ring-4 focus:ring-[#EE2B5B]/10 outline-none transition-all disabled:opacity-50"
                  />
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={submitOtp}
                  disabled={isLoading || otp.join("").length !== 6}
                  className="relative w-full overflow-hidden group bg-[#1b0d11] hover:bg-black disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <span className="tracking-wide text-sm">XÁC THỰC & ĐĂNG NHẬP</span>
                  )}
                </button>
                
                <button 
                  onClick={() => setStep(1)} 
                  disabled={isLoading}
                  className="w-full mt-4 text-sm font-semibold text-gray-500 hover:text-[#EE2B5B] transition-colors"
                >
                  Quay lại đăng ký
                </button>
              </div>
            </div>
          )}

          {/* Chuyển sang đăng nhập */}
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="relative mb-6 flex items-center">
              <div className="flex-grow border-t border-gray-100" />
            </div>
            <p className="text-center text-sm text-gray-500 font-medium">
              Đã có tài khoản?{" "}
              <Link href="/login" className="font-bold text-[#EE2B5B] hover:text-[#d41e4a] transition-colors relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1.5px] after:bottom-0 after:left-0 after:bg-[#EE2B5B] hover:after:scale-x-100 after:origin-bottom-right hover:after:origin-bottom-left after:transition-transform after:duration-300">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
          
          <p className="mt-8 text-center text-[10px] uppercase tracking-widest text-gray-400 font-medium animate-in fade-in duration-1000 delay-500">
            © 2024 Flower Shop
          </p>
        </div>
      </div>
    </div>
  );
}

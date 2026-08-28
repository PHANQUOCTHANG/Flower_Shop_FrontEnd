"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Flower2, Loader, ArrowLeft } from "lucide-react";
import { useLogin } from "@/features/auth/login/hooks/useLogin";
import Alert from "@/components/ui/Alert";
import { useGoogleLogin } from "@react-oauth/google";

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
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // hooks .
  const { login, loginWithGoogle, isLoading, error } = useLogin();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await loginWithGoogle(tokenResponse.access_token);
        setSuccessMessage("Đăng nhập Google thành công! Chuyển hướng...");
      } catch (err) {
        console.error("Lỗi khi xử lý token Google:", err);
      }
    },
    onError: () => console.error("Google Login Failed"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log({ email, password, role: "CUSTOMER", rememberMe });
      await login({ email, password, role: "CUSTOMER", rememberMe });
      setSuccessMessage("Đăng nhập thành công! Chuyển hướng...");
    } catch (err) {
      console.log(err);
    }
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
              Trao gửi yêu thương <br />
              <span className="text-[#ffb3c6] italic font-medium">qua từng cánh hoa</span>
            </h2>
            <p className="text-white/80 max-w-[300px] mx-auto font-light leading-relaxed">
              Khám phá bộ sưu tập hoa tươi nghệ thuật được thiết kế riêng cho mọi khoảnh khắc đáng nhớ.
            </p>
          </div>
        </div>

        {/* ── Right Column: Form ── */}
        <div className="p-8 sm:p-12 md:p-16 flex flex-col justify-center relative bg-white">
          {/* Nút quay lại */}
          <button
            onClick={() => router.push("/")}
            className="group absolute top-8 left-8 inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#EE2B5B] transition-colors"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Trang chủ</span>
          </button>

          <div className="mt-6 lg:mt-0 mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
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
              Mừng trở lại
            </h2>
            <p className="text-gray-500 font-medium text-sm">
              Vui lòng đăng nhập để tiếp tục trải nghiệm mua sắm.
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 animate-in fade-in zoom-in-95 duration-300">
              <Alert type="error" message={error.message} onClose={() => {}} autoClose duration={5000} />
            </div>
          )}
          {successMessage && (
            <div className="mb-6 animate-in fade-in zoom-in-95 duration-300">
              <Alert type="success" message={successMessage} onClose={() => setSuccessMessage("")} autoClose duration={10000} />
            </div>
          )}

          {/* Form */}
          <form className="space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                disabled={isLoading}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50/50 text-[#1b0d11] placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:ring-[#EE2B5B]/10 focus:border-[#EE2B5B] outline-none transition-all disabled:opacity-50 font-medium"
              />
            </div>

            {/* Mật khẩu */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Mật khẩu</label>
                <a href="/forgot-password" className="text-xs font-bold text-[#EE2B5B] hover:text-[#B3163B] transition-colors">
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3.5 pr-12 rounded-xl border-2 border-gray-100 bg-gray-50/50 text-[#1b0d11] placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:ring-[#EE2B5B]/10 focus:border-[#EE2B5B] outline-none transition-all disabled:opacity-50 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#EE2B5B] transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Ghi nhớ */}
            <label className="flex items-center gap-3 cursor-pointer select-none group w-max pt-1 ml-1">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer appearance-none h-4 w-4 rounded-md border-2 border-gray-300 checked:border-[#EE2B5B] checked:bg-[#EE2B5B] transition-colors cursor-pointer"
                />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-500 group-hover:text-gray-800 transition-colors">Ghi nhớ đăng nhập</span>
            </label>

            {/* Nút submit */}
            <div className="pt-2">
              <button
                disabled={isLoading}
                className="relative w-full overflow-hidden group bg-[#EE2B5B] hover:bg-[#d41e4a] disabled:bg-[#EE2B5B]/50 text-white font-bold py-3.5 rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-[#EE2B5B]/25"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                {isLoading ? (
                  <>
                    <Loader size={18} className="animate-spin text-white" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <span className="tracking-wide text-sm uppercase">Đăng nhập</span>
                )}
              </button>
            </div>
          </form>

          {/* Đăng nhập mạng xã hội */}
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="relative mb-6 flex items-center">
              <div className="flex-grow border-t border-gray-100" />
              <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hoặc tiếp tục với</span>
              <div className="flex-grow border-t border-gray-100" />
            </div>
            
            <div className={`grid ${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID" ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
              {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID" && (
                <button 
                  type="button"
                  onClick={() => handleGoogleLogin()}
                  className="flex items-center justify-center gap-2 px-4 h-[44px] border-2 border-gray-100 rounded-xl bg-white hover:border-[#4285F4]/30 hover:bg-[#4285F4]/5 transition-colors group"
                >
                  <GoogleIcon />
                  <span className="text-xs font-bold text-gray-600 group-hover:text-[#4285F4] transition-colors">Google</span>
                </button>
              )}
              <button className="flex items-center justify-center gap-2 px-4 h-[44px] border-2 border-gray-100 rounded-xl bg-white hover:border-[#1877F2]/30 hover:bg-[#1877F2]/5 transition-colors group">
                <FacebookIcon />
                <span className="text-xs font-bold text-gray-600 group-hover:text-[#1877F2] transition-colors">Facebook</span>
              </button>
            </div>
          </div>

          {/* Chuyển sang đăng ký */}
          <p className="mt-10 text-center text-sm text-gray-500 font-medium animate-in fade-in duration-1000 delay-500">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="font-bold text-[#EE2B5B] hover:text-[#d41e4a] transition-colors relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1.5px] after:bottom-0 after:left-0 after:bg-[#EE2B5B] hover:after:scale-x-100 after:origin-bottom-right hover:after:origin-bottom-left after:transition-transform after:duration-300">
              Tạo tài khoản ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

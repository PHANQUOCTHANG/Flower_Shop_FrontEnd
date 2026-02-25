"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Flower2, Mail, Send, ArrowLeft, LockKeyhole, 
  Loader2, CheckCircle2, ShieldCheck, Eye, 
  EyeOff, KeyRound, Smartphone 
} from 'lucide-react';

// Các bước trong quy trình
type Step = 'email' | 'otp' | 'reset' | 'success';

export default function App() {
  // Trạng thái chung
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Trạng thái OTP
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState<number>(59);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Trạng thái Mật khẩu
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPass, setShowPass] = useState<boolean>(false);
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);

  // Đếm ngược thời gian OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Kiểm tra độ mạnh mật khẩu
  const getStrength = () => {
    if (newPassword.length === 0) return { score: 0, label: 'Trống', color: 'bg-slate-200' };
    if (newPassword.length < 6) return { score: 30, label: 'Yếu', color: 'bg-red-500' };
    if (newPassword.length < 10) return { score: 65, label: 'Trung bình', color: 'bg-amber-500' };
    return { score: 100, label: 'Mạnh', color: 'bg-emerald-500' };
  };
  const strength = getStrength();

  // Yêu cầu gửi OTP
  const handleRequestOtp = (e: React.FormEvent): void => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
      setTimer(59);
    }, 1200);
  };

  // Nhập OTP và tự nhảy ô
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otp];
    const latestChar = val.slice(-1);
    newOtp[index] = latestChar;
    setOtp(newOtp);

    if (latestChar && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Xóa OTP bằng Backspace
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Dán mã OTP từ clipboard
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(data)) return;

    const newOtp = [...otp];
    data.split("").forEach((char, i) => { if (i < 6) newOtp[i] = char; });
    setOtp(newOtp);
    otpRefs.current[data.length < 6 ? data.length : 5]?.focus();
  };

  // Xác thực mã OTP
  const handleVerifyOtp = (): void => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('reset');
    }, 1200);
  };

  // Đổi mật khẩu thành công
  const handleResetPassword = (e: React.FormEvent): void => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 1800);
  };

  // Thanh tiến trình
  const renderStepper = () => (
    <div className="flex justify-center items-center gap-2 mb-10">
      {[1, 2, 3].map((s) => {
        const isActive = (step === 'email' && s === 1) || (step === 'otp' && s === 2) || (step === 'reset' && s === 3);
        const isDone = (step === 'otp' && s < 2) || (step === 'reset' && s < 3) || step === 'success';
        return (
          <React.Fragment key={s}>
            <div className={`size-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 shadow-sm ${
              isActive ? 'bg-[#ee2b5b] text-white scale-110 shadow-[#ee2b5b]/30' : 
              isDone ? 'bg-[#ee2b5b]/20 text-[#ee2b5b]' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'
            }`}>
              {isDone && s < (step === 'reset' ? 3 : 2) ? <CheckCircle2 size={16} /> : s}
            </div>
            {s < 3 && <div className={`h-0.5 w-8 rounded-full transition-colors duration-500 ${isDone ? 'bg-[#ee2b5b]/30' : 'bg-slate-100 dark:bg-zinc-800'}`} />}
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f6] dark:bg-[#221015] font-['Inter',_sans-serif] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Hiệu ứng nền */}
        <div className="absolute top-1/4 -left-20 size-96 bg-[#ee2b5b]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 size-96 bg-[#ee2b5b]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-[480px] bg-white dark:bg-[#1a0c10] rounded-[2.5rem] shadow-2xl shadow-[#ee2b5b]/5 p-8 md:p-12 border border-[#ee2b5b]/10 relative z-10 animate-in fade-in zoom-in-95 duration-500">
          
          <div className="flex justify-center mb-8">
             <div className="bg-[#ee2b5b]/10 p-2.5 rounded-2xl text-[#ee2b5b]">
                <Flower2 size={32} />
             </div>
          </div>

          {step !== 'success' && renderStepper()}

          {/* Bước 1: Nhập Email */}
          {step === 'email' && (
            <div className="animate-in fade-in slide-in-from-left-6 duration-500">
              <div className="flex flex-col items-center mb-10 text-center">
                <div className="size-20 bg-[#ee2b5b]/10 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                  <LockKeyhole size={36} className="text-[#ee2b5b]" />
                </div>
                <h1 className="text-3xl font-bold uppercase tracking-tight mb-2 leading-none">Quên mật khẩu</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">Nhập email để nhận mã xác thực OTP khôi phục tài khoản.</p>
              </div>
              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 text-[10px]">Email đăng ký</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ee2b5b] transition-colors" size={20} />
                    <input 
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-transparent focus:ring-4 focus:ring-[#ee2b5b]/10 focus:border-[#ee2b5b] outline-none transition-all font-bold"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <button disabled={isSubmitting} className="w-full h-14 bg-[#ee2b5b] text-white font-black rounded-xl shadow-lg shadow-[#ee2b5b]/20 flex items-center justify-center gap-3 active:scale-95 transition-all">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <>GỬI MÃ OTP <Send size={20} /></>}
                </button>
              </form>
            </div>
          )}

          {/* Bước 2: Xác thực OTP */}
          {step === 'otp' && (
            <div className="animate-in fade-in slide-in-from-right-6 duration-500">
              <div className="flex flex-col items-center mb-10 text-center">
                <div className="size-20 bg-[#ee2b5b]/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <Smartphone size={36} className="text-[#ee2b5b]" />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tight mb-2 leading-none">Xác thực OTP</h1>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed text-center">Mã đã gửi đến:<br/><span className="text-slate-900 dark:text-white font-bold">{email}</span></p>
              </div>

              <div className="space-y-10">
                <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                  {otp.map((data, index) => (
                    <input
                      key={index} type="text" inputMode="numeric" maxLength={1} ref={(el) => { otpRefs.current[index] = el; }}
                      value={data} onChange={(e) => handleOtpChange(e, index)} onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      className="size-11 sm:size-14 text-center text-2xl font-black border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-[#ee2b5b] focus:ring-4 focus:ring-[#ee2b5b]/10 bg-slate-50 dark:bg-transparent outline-none transition-all"
                      placeholder="·"
                    />
                  ))}
                </div>
                <div className="flex flex-col items-center gap-8">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1.5 text-[10px]">Chưa nhận được mã?</p>
                    <button type="button" disabled={timer > 0} onClick={() => setTimer(59)} className={`text-sm font-black transition-all ${timer > 0 ? 'text-slate-300' : 'text-[#ee2b5b] hover:underline'}`}>
                      Gửi lại mã {timer > 0 && `(${timer}s)`}
                    </button>
                  </div>
                  <button onClick={handleVerifyOtp} disabled={otp.join("").length < 6 || isSubmitting} className="w-full h-14 bg-[#ee2b5b] text-white font-black rounded-xl shadow-xl flex items-center justify-center active:scale-95 transition-all disabled:opacity-40">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "XÁC NHẬN"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bước 3: Đặt mật khẩu */}
          {step === 'reset' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
              <div className="text-center mb-8">
                <div className="size-16 bg-[#ee2b5b]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck size={32} className="text-[#ee2b5b]" />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tight mb-2 leading-none">Mật khẩu mới</h1>
                <p className="text-slate-500 text-sm mt-2">Vui lòng thiết lập mật khẩu bảo mật cao.</p>
              </div>
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 ml-1 text-[10px]">Mật khẩu mới</label>
                  <div className="relative group">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type={showPass ? "text" : "password"} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-14 pl-12 pr-12 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-transparent focus:border-[#ee2b5b] outline-none transition-all font-bold"
                      placeholder="Tối thiểu 8 ký tự"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ee2b5b]">
                      {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {/* Thanh đo độ mạnh */}
                  <div className="pt-2 px-1">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase mb-1">
                      <span className="text-slate-400">Độ mạnh</span>
                      <span className={strength.score > 60 ? 'text-emerald-500' : 'text-[#ee2b5b]'}>{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-700 ${strength.color}`} style={{ width: `${strength.score}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 ml-1 text-[10px]">Xác nhận mật khẩu</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type={showConfirmPass ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-14 pl-12 pr-12 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-transparent focus:border-[#ee2b5b] outline-none transition-all font-bold"
                      placeholder="Nhập lại mật khẩu"
                    />
                    <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ee2b5b]">
                      {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <button disabled={isSubmitting || newPassword !== confirmPassword || newPassword.length < 8} className="w-full h-14 bg-[#ee2b5b] text-white font-black rounded-xl shadow-xl flex items-center justify-center active:scale-95 transition-all disabled:opacity-40">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "CẬP NHẬT MẬT KHẨU"}
                </button>
              </form>
            </div>
          )}

          {/* Bước 4: Thành công */}
          {step === 'success' && (
            <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="size-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto shadow-inner">
                <CheckCircle2 size={56} className="text-emerald-500" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-4 leading-none">Hoàn tất!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-10 px-4">Mật khẩu đã được thay đổi. Hãy sử dụng mật khẩu mới để đăng nhập.</p>
              <button className="w-full h-14 bg-emerald-500 text-white font-black rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-widest">
                Đăng nhập ngay
              </button>
            </div>
          )}

          {/* Nút quay lại */}
          {step !== 'success' && (
            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
              <button type="button" onClick={() => {
                if (step === 'otp') setStep('email');
                else if (step === 'reset') setStep('otp');
              }} className="inline-flex items-center gap-2 text-[#ee2b5b] text-sm font-black uppercase tracking-wider hover:opacity-80 group transition-all">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Quay lại {step === 'email' ? 'đăng nhập' : 'bước trước'}
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="py-10 border-t border-[#ee2b5b]/5 text-center opacity-60 shrink-0">
        <p className="text-xs text-slate-400 font-medium italic tracking-wide text-[10px] uppercase">
          © 2024 Flower Shop • Trao gửi yêu thương qua từng cánh hoa.
        </p>
      </footer>
    </div>
  );
}
import React, { useRef, useEffect } from "react";
import { Smartphone, Loader2 } from "lucide-react";

interface OtpStepProps {
 email: string;
 otp: string[];
 timer: number;
 isSubmitting: boolean;
 onOtpChange: (otp: string[]) => void;
 onVerify: () => Promise<void>;
 onResendOtp: () => Promise<void>;
}

export default function OtpStep({
 email,
 otp,
 timer,
 isSubmitting,
 onOtpChange,
 onVerify,
 onResendOtp,
}: OtpStepProps) {
 const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

 const handleOtpChange = (index: number, value: string) => {
 if (!/^\d*$/.test(value)) return;

 const newOtp = [...otp];
 const latestChar = value.slice(-1);
 newOtp[index] = latestChar;
 onOtpChange(newOtp);

 if (latestChar && index < 5) {
 otpRefs.current[index + 1]?.focus();
 }
 };

 const handleOtpKeyDown = (
 e: React.KeyboardEvent<HTMLInputElement>,
 index: number,
 ) => {
 if (e.key === "Backspace" && !otp[index] && index > 0) {
 otpRefs.current[index - 1]?.focus();
 }
 };

 const handleOtpPaste = (e: React.ClipboardEvent) => {
 e.preventDefault();
 const data = e.clipboardData.getData("text").slice(0, 6);
 if (!/^\d+$/.test(data)) return;

 const newOtp = [...otp];
 data.split("").forEach((char, i) => {
 if (i < 6) newOtp[i] = char;
 });
 onOtpChange(newOtp);
 otpRefs.current[data.length < 6 ? data.length : 5]?.focus();
 };

 return (
 <div className="animate-in fade-in slide-in-from-right-6 duration-500">
 <div className="flex flex-col items-center mb-10 text-center">
 <div className="size-20 bg-[#ee2b5b]/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
 <Smartphone size={36} className="text-[#ee2b5b]" />
 </div>
 <h1 className="text-3xl font-black uppercase tracking-tight mb-2 leading-none">
 Xác thực OTP
 </h1>
 <p className="text-slate-500 text-sm mt-2 leading-relaxed text-center">
 Mã đã gửi đến:
 <br />
 <span className="text-slate-900 font-bold">
 {email}
 </span>
 </p>
 </div>

 <div className="space-y-10">
 <div
 className="flex justify-center gap-2 sm:gap-3"
 onPaste={handleOtpPaste}
 >
 {otp.map((data, index) => (
 <input
 key={index}
 type="text"
 inputMode="numeric"
 maxLength={1}
 ref={(el) => {
 otpRefs.current[index] = el;
 }}
 value={data}
 disabled={isSubmitting}
 onChange={(e) => handleOtpChange(index, e.target.value)}
 onKeyDown={(e) => handleOtpKeyDown(e, index)}
 className="size-11 sm:size-14 text-center text-2xl font-black border-2 border-slate-100 rounded-xl focus:border-[#ee2b5b] focus:ring-4 focus:ring-[#ee2b5b]/10 bg-slate-50 outline-none transition-all placeholder:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
 placeholder="·"
 />
 ))}
 </div>
 <div className="flex flex-col items-center gap-8">
 <div className="text-center">
 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1.5 text-[10px]">
 Chưa nhận được mã?
 </p>
 <button
 type="button"
 disabled={timer > 0 || isSubmitting}
 onClick={onResendOtp}
 className={`text-sm font-black transition-all ${
 timer > 0
 ? "text-slate-300 cursor-not-allowed"
 : "text-[#ee2b5b] hover:underline"
 }`}
 >
 Gửi lại mã {timer > 0 && `(${timer}s)`}
 </button>
 </div>
 <button
 onClick={onVerify}
 disabled={otp.join("").length < 6 || isSubmitting}
 className="w-full h-14 bg-[#ee2b5b] text-white font-black rounded-xl shadow-xl flex items-center justify-center active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
 >
 {isSubmitting ? <Loader2 className="animate-spin" /> : "XÁC NHẬN"}
 </button>
 </div>
 </div>
 </div>
 );
}



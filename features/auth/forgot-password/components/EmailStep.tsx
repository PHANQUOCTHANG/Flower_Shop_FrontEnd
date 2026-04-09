import React from "react";
import { Mail, Send, Loader2, LockKeyhole } from "lucide-react";

interface EmailStepProps {
 email: string;
 isSubmitting: boolean;
 onEmailChange: (email: string) => void;
 onSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function EmailStep({
 email,
 isSubmitting,
 onEmailChange,
 onSubmit,
}: EmailStepProps) {
 return (
 <div className="animate-in fade-in slide-in-from-left-6 duration-500">
 <div className="flex flex-col items-center mb-10 text-center">
 <div className="size-20 bg-[#ee2b5b]/10 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
 <LockKeyhole size={36} className="text-[#ee2b5b]" />
 </div>
 <h1 className="text-3xl font-bold uppercase tracking-tight mb-2 leading-none">
 Quên mật khẩu
 </h1>
 <p className="text-slate-500 text-sm mt-2 leading-relaxed">
 Nhập email để nhận mã xác thực OTP khôi phục tài khoản.
 </p>
 </div>
 <form onSubmit={onSubmit} className="space-y-6">
 <div className="space-y-2">
 <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 text-[10px]">
 Email đăng ký
 </label>
 <div className="relative group">
 <Mail
 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ee2b5b] transition-colors"
 size={20}
 />
 <input
 type="email"
 required
 disabled={isSubmitting}
 value={email}
 onChange={(e) => onEmailChange(e.target.value)}
 className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-slate-100 bg-slate-50 focus:ring-4 focus:ring-[#ee2b5b]/10 focus:border-[#ee2b5b] outline-none transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
 placeholder="email@example.com"
 />
 </div>
 </div>
 <button
 disabled={isSubmitting}
 className="w-full h-14 bg-[#ee2b5b] text-white font-black rounded-xl shadow-lg shadow-[#ee2b5b]/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {isSubmitting ? (
 <Loader2 className="animate-spin" />
 ) : (
 <>
 GỬI MÃ OTP <Send size={20} />
 </>
 )}
 </button>
 </form>
 </div>
 );
}



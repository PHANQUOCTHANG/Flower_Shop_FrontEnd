import React from "react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SuccessStep() {
  return (
    <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="size-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto shadow-inner">
        <CheckCircle2 size={56} className="text-emerald-500" />
      </div>
      <h2 className="text-3xl font-black uppercase tracking-tight mb-4 leading-none">
        Hoàn tất!
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-10 px-4">
        Mật khẩu đã được thay đổi. Hãy sử dụng mật khẩu mới để đăng nhập.
      </p>
      <Link
        href="/login"
        className="inline-block w-full h-14 bg-emerald-500 text-white font-black rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-widest hover:bg-emerald-600"
      >
        Đăng nhập ngay
      </Link>
    </div>
  );
}

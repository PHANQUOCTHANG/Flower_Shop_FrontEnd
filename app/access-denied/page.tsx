'use client'

import { Lock, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

/**
 * Trang Access Denied (403 Forbidden) - Phiên bản tối giản
 */
export default function AccessDeniedPage() {
  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcf8f9] dark:bg-[#101412] font-['Inter',_sans-serif] p-6 transition-colors duration-300">
      <div className="w-full max-w-md text-center animate-in fade-in zoom-in-95 duration-500">
        {/* Biểu tượng khóa tối giản */}
        <div className="mb-8 flex justify-center">
          <div className="size-24 rounded-3xl bg-[#ee2b5b]/10 flex items-center justify-center text-[#ee2b5b] shadow-inner">
            <Lock size={48} strokeWidth={2.5} />
          </div>
        </div>

        {/* Thông báo lỗi */}
        <div className="space-y-3 mb-10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Truy cập bị từ chối
          </h2>
        </div>

        {/* Các nút hành động chính */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full h-14 bg-[#ee2b5b] text-white font-black rounded-2xl shadow-lg shadow-[#ee2b5b]/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs"
          >
            <Home size={18} />
            Về trang chủ
          </Link>

          <button
            onClick={handleGoBack}
            className="w-full h-14 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all uppercase tracking-widest text-xs"
          >
            <ArrowLeft size={18} />
            Quay lại trang trước
          </button>
        </div>
      </div>
    </div>
  );
}

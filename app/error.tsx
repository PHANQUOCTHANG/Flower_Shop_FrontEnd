"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw, Home } from "lucide-react";

// Error Boundary cho toàn bộ route con của app/ (trừ lỗi xảy ra trong chính
// root layout — trường hợp đó rơi vào global-error.tsx). Bắt mọi lỗi render/
// throw không kiểm soát để hiển thị fallback UI thay vì trang trắng mặc định.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Chỗ này sau này có thể nối thêm Sentry/LogRocket... để nhận cảnh báo real-time
    console.error("[Error Boundary]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfbf9] font-sans p-6 transition-colors duration-300">
      <div className="w-full max-w-md text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-8 flex justify-center">
          <div className="size-24 rounded-3xl bg-[#13ec5b]/10 flex items-center justify-center text-[#13ec5b] shadow-inner">
            <AlertTriangle size={48} strokeWidth={2.5} />
          </div>
        </div>

        <div className="space-y-3 mb-10">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
            Đã có lỗi xảy ra
          </h2>
          <p className="text-[#4c9a66]">
            Rất tiếc, trang gặp sự cố ngoài ý muốn. Bạn có thể thử lại hoặc
            quay về trang chủ.
          </p>
          {error.digest && (
            <p className="text-xs text-slate-400">Mã lỗi: {error.digest}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full h-14 bg-[#13ec5b] text-white font-black rounded-2xl shadow-lg shadow-[#13ec5b]/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs"
          >
            <RotateCw size={18} />
            Thử lại
          </button>

          <Link
            href="/"
            className="w-full h-14 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
          >
            <Home size={18} />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

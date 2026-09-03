"use client";

import { useEffect } from "react";
import "./globals.css";

// Bắt lỗi xảy ra ngay trong root layout (app/layout.tsx) — trường hợp duy nhất
// error.tsx thường không bắt được. Next.js yêu cầu file này tự khai báo lại
// <html>/<body> vì nó thay thế toàn bộ root layout khi kích hoạt.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error Boundary]", error);
  }, [error]);

  return (
    <html lang="vi">
      <body className="font-sans">
        <div className="min-h-screen flex items-center justify-center bg-[#fcfbf9] p-6">
          <div className="w-full max-w-md text-center">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-3">
              Ứng dụng gặp sự cố
            </h2>
            <p className="text-[#4c9a66] mb-8">
              Rất tiếc, đã có lỗi nghiêm trọng xảy ra. Vui lòng tải lại trang.
            </p>
            {error.digest && (
              <p className="text-xs text-slate-400 mb-6">
                Mã lỗi: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              className="w-full h-14 bg-[#13ec5b] text-white font-black rounded-2xl shadow-lg shadow-[#13ec5b]/20 uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

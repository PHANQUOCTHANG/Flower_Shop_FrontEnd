import { Flower2 } from "lucide-react";

export const Loading = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f6f8f6] dark:bg-[#102216]">
      <div className="relative">
        {/* Vòng tròn hiệu ứng xung quanh */}
        <div className="absolute inset-0 scale-150 animate-ping rounded-full bg-[#13ec5b]/20"></div>
        
        {/* Biểu tượng hoa xoay */}
        <div className="relative flex items-center justify-center bg-white dark:bg-zinc-900 size-20 rounded-3xl shadow-xl border border-[#13ec5b]/20">
          <Flower2 className="text-[#13ec5b] animate-spin-slow" size={40} />
        </div>
      </div>
      
      {/* Văn bản thông báo */}
      <div className="mt-8 text-center">
        <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Quốc Thắng</h2>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <span className="text-xs font-bold text-slate-400">Đang tải dữ liệu</span>
          <div className="flex gap-0.5 mt-1">
            <div className="size-1 bg-[#13ec5b] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="size-1 bg-[#13ec5b] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="size-1 bg-[#13ec5b] rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};
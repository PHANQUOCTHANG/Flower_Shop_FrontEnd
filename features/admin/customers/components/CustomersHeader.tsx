"use client";

import { PlusCircle } from "lucide-react";

export const CustomersHeader = () => {
  return (
    <header className="sticky top-0 z-30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 bg-white/80 backdrop-blur-xl px-4 sm:px-6 md:px-8 py-4 sm:py-5">
      <h1 className="text-slate-900 text-xl sm:text-2xl font-black tracking-tight uppercase">
        Quản lý khách hàng
      </h1>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Nút thêm khách hàng mới */}
        <button className="flex items-center gap-2 bg-[#13ec5b] text-[#102216] px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-[#13ec5b]/30 hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
          <PlusCircle size={18} />
          <span>Thêm khách hàng</span>
        </button>
      </div>
    </header>
  );
};

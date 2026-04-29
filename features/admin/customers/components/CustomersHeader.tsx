"use client";

import { PlusCircle } from "lucide-react";

export const CustomersHeader = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl px-4 sm:px-6 md:px-8 py-4">
      <div className="flex items-center justify-between max-w-[1400px] mx-auto gap-3">
        <div className="min-w-0">
          <h1 className="text-slate-900 text-lg sm:text-2xl font-black uppercase tracking-tight truncate">
            Quản lý khách hàng
          </h1>
          <p className="hidden sm:block text-slate-400 text-xs mt-0.5 font-medium">
            Thông tin và lịch sử mua hàng của thành viên
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Nút thêm khách hàng mới */}
          <button className="flex items-center gap-2 bg-[#13ec5b] text-[#102216] px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md shadow-[#13ec5b]/30 hover:scale-105 active:scale-95 transition-all">
            <PlusCircle size={18} />
            <span className="hidden sm:inline">Thêm khách hàng</span>
            <span className="sm:hidden">Thêm mới</span>
          </button>
        </div>
      </div>
    </header>
  );
};

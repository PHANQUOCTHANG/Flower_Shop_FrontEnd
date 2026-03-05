import React from "react";
import { Bell, PlusCircle } from "lucide-react";

export const ProductPageHeader = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl px-8 py-5">
      <div className="flex items-center justify-between max-w-[1400px] mx-auto">
        <h1 className="text-slate-900 dark:text-white text-2xl font-black uppercase tracking-tight">
          Quản lý sản phẩm
        </h1>
        <div className="flex items-center gap-4">
          {/* Nút thông báo */}
          <button className="relative p-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
            <Bell size={20} />
            <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-red-500"></span>
          </button>
          {/* Nút thêm sản phẩm */}
          <button className="flex items-center gap-2 bg-[#13ec5b] text-[#102216] px-6 py-3 rounded-xl text-sm font-black shadow-lg shadow-[#13ec5b]/30 hover:scale-105 active:scale-95 transition-all">
            <PlusCircle size={20} />
            <span>Thêm sản phẩm</span>
          </button>
        </div>
      </div>
    </header>
  );
};

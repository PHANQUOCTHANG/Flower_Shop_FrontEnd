import React from "react";
import { PlusCircle, Bell, Download } from "lucide-react";

export const OrdersHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl px-4 sm:px-6 md:px-8 py-4">
      <div className="flex items-center justify-between max-w-[1440px] mx-auto gap-3">
        <div className="min-w-0">
          <h1 className="text-slate-900 text-lg sm:text-2xl font-black uppercase tracking-tight truncate">
            Quản lý đơn hàng
          </h1>
          <p className="hidden sm:block text-slate-400 text-xs mt-0.5 font-medium">
            Theo dõi và xử lý tất cả đơn đặt hàng
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Xuất báo cáo – chỉ hiển thị trên sm+ */}
          <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold shadow-sm hover:bg-slate-50 transition-all">
            <Download size={15} />
            <span>Xuất báo cáo</span>
          </button>

          {/* Thông báo */}
          <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
            <Bell size={19} />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Tạo đơn mới */}
          <button className="flex items-center gap-2 bg-[#13ec5b] text-[#102216] px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md shadow-[#13ec5b]/30 hover:scale-105 active:scale-95 transition-all">
            <PlusCircle size={18} />
            <span className="hidden sm:inline">Tạo đơn mới</span>
            <span className="sm:hidden">Tạo mới</span>
          </button>
        </div>
      </div>
    </header>
  );
};

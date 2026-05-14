import React from "react";
import { PlusCircle, Search, X } from "lucide-react";

interface CategoryHeaderProps {
  onAdd: () => void;
  searchKeyword: string;
  onSearchChange: (value: string) => void;
}

export const CategoryHeader = ({ onAdd, searchKeyword, onSearchChange }: CategoryHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl px-4 sm:px-6 md:px-8 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between max-w-[1400px] mx-auto gap-4">
        <div className="min-w-0">
          <h1 className="text-slate-900 text-lg sm:text-2xl font-black uppercase tracking-tight truncate">
            Quản lý danh mục
          </h1>
          <p className="hidden sm:block text-slate-400 text-xs mt-0.5 font-medium">
            Phân loại sản phẩm theo các nhóm hoa
          </p>
        </div>

        <div className="flex flex-1 md:flex-none items-center gap-2 sm:gap-3">
          {/* Ô tìm kiếm */}
          <div className="relative flex-1 md:w-64 min-w-0">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
              type="text"
              placeholder="Tìm tên danh mục..."
              className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#13ec5b]/40 focus:border-[#13ec5b] transition-all"
            />
            {searchKeyword && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-all"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Thêm danh mục */}
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-[#13ec5b] text-[#102216] px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md shadow-[#13ec5b]/30 hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            <PlusCircle size={18} />
            <span className="hidden sm:inline">Thêm danh mục</span>
            <span className="sm:hidden">Thêm</span>
          </button>
        </div>
      </div>
    </header>
  );
};

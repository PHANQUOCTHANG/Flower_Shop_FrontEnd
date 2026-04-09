"use client";

import { Search } from "lucide-react";

interface CustomersSearchProps {
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
}

export const CustomersSearch = ({
  searchKeyword,
  onSearchChange,
}: CustomersSearchProps) => {
  return (
    <div className="relative">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />
      <input
        value={searchKeyword}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-12 pr-4 py-3 border-none rounded-xl bg-white text-slate-900 placeholder:text-slate-500 text-sm font-medium focus:ring-2 focus:ring-[#13ec5b] transition-all shadow-sm"
        placeholder="Tìm tên, SĐT, email..."
        type="text"
      />
    </div>
  );
};

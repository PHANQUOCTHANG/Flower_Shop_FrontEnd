import React, { useState } from "react";
import { Search, SlidersHorizontal, X, Star, ChevronDown } from "lucide-react";

interface CustomerFiltersProps {
  searchKeyword: string;
  selectedTier: string;
  onSearchChange: (keyword: string) => void;
  onTierChange: (tier: string) => void;
}

const TIER_OPTIONS = ["Tất cả", "VIP", "Vàng", "Bạc", "Đồng"];

export const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  searchKeyword,
  selectedTier,
  onSearchChange,
  onTierChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = selectedTier !== "Tất cả" ? 1 : 0;
  const hasAnyFilter = searchKeyword !== "" || activeFilterCount > 0;

  const handleClear = () => {
    onSearchChange("");
    onTierChange("Tất cả");
    setIsOpen(false);
  };

  const clearSearch = () => onSearchChange("");

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 sm:px-6 py-4 flex flex-col gap-3 mb-6">
      {/* ── Hàng 1: Tìm kiếm + Nút bộ lọc nâng cao ────────── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Ô tìm kiếm */}
        <div className="relative flex-1 min-w-0">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            type="text"
            placeholder="Tìm tên, email, sđt khách hàng..."
            className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#13ec5b]/40 focus:border-[#13ec5b] transition-all"
          />
          {searchKeyword && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-all"
              title="Xóa tìm kiếm"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Nút bộ lọc nâng cao */}
        <button
          onClick={() => setIsOpen((o) => !o)}
          className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl border text-sm font-bold transition-all duration-200 shrink-0 ${
            isOpen || activeFilterCount > 0
              ? "bg-[#13ec5b]/10 border-[#13ec5b]/50 text-[#0b7a2f]"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
          }`}
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Bộ lọc</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
          {/* Badge số lượng bộ lọc đang dùng */}
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-[#13ec5b] text-[#102216] text-[10px] font-black rounded-full leading-none px-1 shadow">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Nút xóa lọc */}
        {hasAnyFilter && (
          <button
            onClick={handleClear}
            title="Xóa tất cả bộ lọc"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all duration-200 shrink-0"
          >
            <X size={14} />
            <span className="hidden sm:inline">Xóa lọc</span>
          </button>
        )}
      </div>

      {/* ── Hàng 2: Panel bộ lọc nâng cao (co/giãn) ─────────── */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-4 sm:p-5 mt-0.5">
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                <Star size={11} className="text-slate-400" />
                Hạng thành viên
              </label>
              <div className="flex flex-wrap gap-2">
                {TIER_OPTIONS.map((tier) => {
                  const isActive = selectedTier === tier;
                  return (
                    <button
                      key={tier}
                      onClick={() => onTierChange(tier)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        isActive
                          ? "bg-[#13ec5b] text-[#102216] border-[#13ec5b] shadow-sm"
                          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                      }`}
                    >
                      {tier}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer panel */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-400 font-medium">
                {activeFilterCount > 0
                  ? "Đang lọc theo hạng thành viên"
                  : "Chưa chọn bộ lọc nào"}
              </p>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => {
                      onTierChange("Tất cả");
                      setIsOpen(false);
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-red-500 bg-white border border-slate-200 hover:border-red-200 rounded-xl transition-all"
                  >
                    Đặt lại
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-black text-[#102216] bg-[#13ec5b] rounded-xl hover:bg-[#0fd44f] hover:scale-105 active:scale-95 transition-all shadow-sm shadow-[#13ec5b]/20"
                >
                  <SlidersHorizontal size={13} />
                  Hoàn tất
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Tag,
  BarChart2,
  ArrowUpDown,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import { CategoryItem } from "@/features/admin/products/types";

interface FilterBarProps {
  searchKeyword: string;
  selectedCategory: string | undefined;
  selectedStatus?: string;
  sortBy: string;
  minPrice: number | null;
  maxPrice: number | null;
  categories: CategoryItem[];
  priceRanges: Array<{
    value: string;
    label: string;
    min: number | null;
    max: number | null;
  }>;
  hasActiveFilters: boolean;
  // Ẩn bộ lọc trạng thái ở trang thùng rác (mọi sản phẩm ở đó đều đã bị xóa)
  showStatusFilter?: boolean;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onStatusChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPriceRangeChange: (minVal: number | null, maxVal: number | null) => void;
  onApplyFilter: () => void;
  onClearFilter: () => void;
}

export const FilterBar = ({
  searchKeyword,
  selectedCategory,
  selectedStatus = "all",
  sortBy,
  minPrice,
  maxPrice,
  categories,
  priceRanges,
  hasActiveFilters,
  showStatusFilter = true,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onSortChange,
  onPriceRangeChange,
  onApplyFilter,
  onClearFilter,
}: FilterBarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Tìm selected price range value dựa trên minPrice và maxPrice
  const selectedPriceValue = useMemo(() => {
    const found = priceRanges.find(
      (range) => range.min === minPrice && range.max === maxPrice,
    );
    return found ? found.value : "all";
  }, [minPrice, maxPrice, priceRanges]);

  const handlePriceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRange = priceRanges.find(
      (range) => range.value === e.target.value,
    );
    if (selectedRange) {
      onPriceRangeChange(selectedRange.min, selectedRange.max);
    }
  };

  // Đếm số bộ lọc nâng cao đang áp dụng
  const activeFilterCount = [
    selectedCategory && selectedCategory !== "Tất cả",
    showStatusFilter && selectedStatus !== "all",
    sortBy !== "newest",
    minPrice !== null || maxPrice !== null,
  ].filter(Boolean).length;

  const hasAnyFilter = searchKeyword !== "" || activeFilterCount > 0;

  const clearSearch = () =>
    onSearchChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);

  const handleApply = () => {
    onApplyFilter();
    setIsOpen(false);
  };

  const handleClear = () => {
    onClearFilter();
    setIsOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 sm:px-6 py-4 flex flex-col gap-3">
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
            onChange={onSearchChange}
            onKeyDown={(e) => e.key === "Enter" && onApplyFilter()}
            type="text"
            placeholder="Tìm tên hoa, mã sản phẩm..."
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
          <span className="hidden sm:inline">Bộ lọc nâng cao</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
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
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${
                showStatusFilter ? "lg:grid-cols-4" : "lg:grid-cols-3"
              }`}
            >
              {/* Danh mục */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <Tag size={11} className="text-slate-400" />
                  Danh mục
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory ?? "Tất cả"}
                    onChange={onCategoryChange}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#13ec5b]/40 focus:border-[#13ec5b] transition-all cursor-pointer appearance-none pr-8"
                  >
                    <option value="Tất cả">Tất cả danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Trạng thái */}
              {showStatusFilter && (
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    <BarChart2 size={11} className="text-slate-400" />
                    Trạng thái
                  </label>
                  <div className="relative">
                    <select
                      value={selectedStatus}
                      onChange={onStatusChange}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#13ec5b]/40 focus:border-[#13ec5b] transition-all cursor-pointer appearance-none pr-8"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="active">Hoạt động</option>
                      <option value="hidden">Đang ẩn</option>
                      <option value="draft">Bản nháp</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Khoảng giá */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <DollarSign size={11} className="text-slate-400" />
                  Khoảng giá
                </label>
                <div className="relative">
                  <select
                    value={selectedPriceValue}
                    onChange={handlePriceSelect}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#13ec5b]/40 focus:border-[#13ec5b] transition-all cursor-pointer appearance-none pr-8"
                  >
                    {priceRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Sắp xếp */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <ArrowUpDown size={11} className="text-slate-400" />
                  Sắp xếp
                </label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={onSortChange}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#13ec5b]/40 focus:border-[#13ec5b] transition-all cursor-pointer appearance-none pr-8"
                  >
                    <option value="newest">Mới nhất trước</option>
                    <option value="oldest">Cũ nhất trước</option>
                    <option value="price-asc">Giá tăng dần</option>
                    <option value="price-desc">Giá giảm dần</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Footer panel */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-400 font-medium">
                {activeFilterCount > 0
                  ? `${activeFilterCount} bộ lọc đang áp dụng`
                  : "Chưa chọn bộ lọc nào"}
              </p>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleClear}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-red-500 bg-white border border-slate-200 hover:border-red-200 rounded-xl transition-all"
                  >
                    Đặt lại
                  </button>
                )}
                <button
                  onClick={handleApply}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-black text-[#102216] bg-[#13ec5b] rounded-xl hover:bg-[#0fd44f] hover:scale-105 active:scale-95 transition-all shadow-sm shadow-[#13ec5b]/20"
                >
                  <SlidersHorizontal size={13} />
                  Áp dụng bộ lọc
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

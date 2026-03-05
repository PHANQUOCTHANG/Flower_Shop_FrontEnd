import React, { useMemo } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { CategoryItem } from "@/features/admin/products/types";

interface FilterBarProps {
  searchKeyword: string;
  selectedCategory: string | undefined;
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
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPriceRangeChange: (minVal: number | null, maxVal: number | null) => void;
  onApplyFilter: () => void;
  onClearFilter: () => void;
}

export const FilterBar = ({
  searchKeyword,
  selectedCategory,
  sortBy,
  minPrice,
  maxPrice,
  categories,
  priceRanges,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onPriceRangeChange,
  onApplyFilter,
  onClearFilter,
}: FilterBarProps) => {
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
  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
      {/* Nhóm left: Tìm kiếm, danh mục, giá */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center flex-wrap">
        {/* Tìm kiếm */}
        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            value={searchKeyword}
            onChange={onSearchChange}
            className="w-full pl-12 pr-4 py-2.5 border-none rounded-xl bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder:text-slate-500 text-sm font-medium focus:ring-2 focus:ring-[#13ec5b] transition-all shadow-sm"
            placeholder="Tìm tên hoa, mã sản phẩm..."
            type="text"
          />
        </div>

        {/* Bộ lọc danh mục */}
        <select
          value={selectedCategory}
          onChange={onCategoryChange}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#13ec5b] transition-all shadow-sm cursor-pointer"
        >
          <option value={undefined}>Tất cả</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Lọc khung giá */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase whitespace-nowrap">
            Giá:
          </label>
          <select
            value={selectedPriceValue}
            onChange={handlePriceSelect}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#13ec5b] transition-all shadow-sm cursor-pointer"
          >
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Nhóm right: Sắp xếp và nút lọc */}
      <div className="flex items-center gap-3">
        {/* Nút lọc */}
        <button
          onClick={onApplyFilter}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#13ec5b] text-[#102216] text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-sm"
        >
          <Filter size={16} />
          <span>Lọc</span>
        </button>

        {/* Nút xóa lọc */}
        <button
          onClick={onClearFilter}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 active:scale-95 transition-all shadow-sm"
        >
          <X size={16} />
          <span>Xóa lọc</span>
        </button>
        <label className="text-xs font-bold text-slate-500 uppercase whitespace-nowrap">
          Sắp xếp:
        </label>
        <div className="relative">
          <select
            value={sortBy}
            onChange={onSortChange}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#13ec5b] transition-all shadow-sm cursor-pointer appearance-none pr-10"
          >
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={18}
          />
        </div>
      </div>
    </div>
  );
};

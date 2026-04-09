import { LayoutGrid, List, Search, X } from "lucide-react";

type ViewMode = "grid" | "list";

interface ProductToolbarProps {
  viewMode: ViewMode;
  searchInput: string;
  sort: string;
  hasActiveFilters: boolean;
  onViewModeChange: (mode: ViewMode) => void;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
}

// Toolbar với search, sort, view mode, clear filters
export function ProductToolbar({
  viewMode,
  searchInput,
  sort,
  hasActiveFilters,
  onViewModeChange,
  onSearchChange,
  onSearch,
  onSortChange,
  onClearFilters,
}: ProductToolbarProps) {
  return (
    <div className="mb-12 space-y-3">
      <div className="flex items-center gap-2 w-full">
        {/* Toggle view mode: Grid/List */}
        <div className="flex items-center gap-1 bg-[#e7f3eb] p-1 rounded-xl shrink-0">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-[#13ec5b]" : "text-[#4c9a66] hover:text-[#0d1b12]"}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-[#13ec5b]" : "text-[#4c9a66] hover:text-[#0d1b12]"}`}
          >
            <List size={18} />
          </button>
        </div>

        {/* Search form */}
        <form
          onSubmit={onSearch}
          className="flex flex-1 items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-[#e7f3eb] min-w-0"
        >
          <Search size={16} className="text-[#4c9a66] shrink-0" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-[#0d1b12] placeholder:text-[#4c9a66] text-sm w-full"
          />
          <button
            type="submit"
            className="shrink-0 px-3 py-1 bg-[#13ec5b] text-[#0d1b12] rounded-lg font-semibold hover:bg-[#13ec5b]/90 transition-colors text-xs"
          >
            Tìm
          </button>
        </form>

        {/* Sort dropdown */}
        <div className="shrink-0 bg-white p-2 px-4 rounded-xl border border-[#e7f3eb] flex items-center gap-3">
          <span className="typo-caption-xs text-[#4c9a66] whitespace-nowrap hidden sm:inline">
            Sắp xếp:
          </span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent border-none typo-body-sm font-bold text-[#0d1b12] focus:ring-0 p-0 cursor-pointer outline-none"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="price-asc">Giá (thấp → cao)</option>
            <option value="price-desc">Giá (cao → thấp)</option>
          </select>
        </div>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-[#e7f3eb] rounded-xl text-[#0d1b12] hover:bg-slate-50 transition-all typo-body-sm font-bold"
          >
            <X size={16} />
            <span className="hidden sm:inline">Xóa lọc</span>
          </button>
        )}
      </div>
    </div>
  );
}

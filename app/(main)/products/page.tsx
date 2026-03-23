"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, CheckCircle, LayoutGrid, List, Search, X } from "lucide-react";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useCategories } from "@/features/products/hooks/useCategories";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FilterSection } from "@/features/products/components/FilterSection";
import { ProductCard } from "@/features/products/components/ProductCard";
import { Loading } from "@/components/ui/Loading";
import { Pagination } from "@/components/ui/Pagination";

const PRICE_RANGES = [
  { value: "all", label: "Tất cả giá", min: null, max: null },
  { value: "under-500k", label: "Dưới 500.000₫", min: 1, max: 499000 },
  {
    value: "500k-1m",
    label: "500.000₫ - 1.000.000₫",
    min: 500000,
    max: 1000000,
  },
  {
    value: "1m-2m",
    label: "1.000.000₫ - 2.000.000₫",
    min: 1000000,
    max: 2000000,
  },
  { value: "above-2m", label: "Trên 2.000.000₫", min: 2000000, max: null },
];

// ─── Helper: build query string, bỏ qua các giá trị null/undefined/default ───
function buildQuery(
  params: Record<string, string | number | null | undefined>,
): string {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== "") p.set(k, String(v));
  });
  const qs = p.toString();
  return qs ? `?${qs}` : "";
}

export default function FlowerCollection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ─── Đọc filter từ URL (source of truth) ──────────────────────────────────
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const minPrice = searchParams.get("minPrice")
    ? parseInt(searchParams.get("minPrice")!)
    : null;
  const maxPrice = searchParams.get("maxPrice")
    ? parseInt(searchParams.get("maxPrice")!)
    : null;
  const selectedCategory = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const searchQuery = searchParams.get("search") || "";

  // searchInput là local state — chỉ sync lên URL khi user submit form
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // ─── Data fetching ─────────────────────────────────────────────────────────
  const {
    products,
    loading: productsLoading,
    fetching,
    totalPages = 1,
  } = useProducts({
    page: currentPage,
    limit: 6,
    search: searchQuery || undefined,
    priceMin: minPrice,
    priceMax: maxPrice,
    category: selectedCategory || undefined,
    sort,
  });

  const { categories, loading: categoriesLoading } = useCategories({
    limit: 6,
  });

  // ─── Derived state ─────────────────────────────────────────────────────────
  const hasActiveFilters = useMemo(
    () =>
      minPrice !== null ||
      maxPrice !== null ||
      selectedCategory !== "" ||
      sort !== "newest" ||
      searchQuery !== "",
    [minPrice, maxPrice, selectedCategory, sort, searchQuery],
  );

  // ─── Shared navigate helper — giữ lại các filter hiện tại, override phần cần đổi
  const navigate = useCallback(
    (overrides: Record<string, string | number | null | undefined>) => {
      const base: Record<string, string | number | null | undefined> = {
        page: currentPage,
        minPrice,
        maxPrice,
        category: selectedCategory || null,
        sort: sort !== "newest" ? sort : null,
        search: searchQuery || null,
      };
      // page luôn reset về 1 khi đổi filter (trừ khi override có page)
      const merged = { ...base, page: 1, ...overrides };
      router.push(`/products${buildQuery(merged)}`);
    },
    [
      currentPage,
      minPrice,
      maxPrice,
      selectedCategory,
      sort,
      searchQuery,
      router,
    ],
  );

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    navigate({ page });
  };

  const handlePriceChange = (minVal: number | null, maxVal: number | null) => {
    navigate({ minPrice: minVal, maxPrice: maxVal });
  };

  const handleCategoryChange = (slug: string, isChecked: boolean) => {
    navigate({ category: isChecked ? slug : null });
  };

  const handleSort = (newSort: string) => {
    navigate({ sort: newSort !== "newest" ? newSort : null });
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate({ search: searchInput.trim() || null });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    router.push("/products");
  };

  // ─── First load ────────────────────────────────────────────────────────────
  if (productsLoading || categoriesLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#fcfbf9] dark:bg-[#1a0f12] text-[#1b0d11] dark:text-white transition-colors duration-300 font-sans antialiased">
      <div className="max-w-360 mx-auto px-4 sm:px-10 lg:px-20 py-10">
        <Breadcrumbs
          items={[{ label: "Trang chủ", href: "/" }, { label: "Sản phẩm" }]}
        />

        <div className="flex flex-col lg:flex-row gap-12">
          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-28 space-y-2">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Filter size={20} className="text-[#13ec5b]" />
                  <h3 className="typo-heading-md text-[#0d1b12] dark:text-white">
                    Bộ lọc
                  </h3>
                </div>
                <p className="typo-caption-xs text-[#4c9a66]">
                  Tinh chỉnh lựa chọn
                </p>
              </div>

              <FilterSection title="Khoảng giá">
                {PRICE_RANGES.map((range) => (
                  <label
                    key={range.value}
                    className="flex items-center gap-3 cursor-pointer group/item"
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          minPrice === range.min && maxPrice === range.max
                        }
                        onChange={(e) =>
                          handlePriceChange(
                            e.target.checked ? range.min : null,
                            e.target.checked ? range.max : null,
                          )
                        }
                        className="peer appearance-none size-5 border-2 border-[#ccc] dark:border-white/20 rounded-md checked:bg-[#13ec5b] checked:border-[#13ec5b] transition-all"
                      />
                      <CheckCircle
                        size={12}
                        className="absolute left-1 text-[#0d1b12] opacity-0 peer-checked:opacity-100 transition-opacity"
                      />
                    </div>
                    <span className="typo-body-sm text-[#4c9a66] dark:text-white/60 group-hover/item:text-[#13ec5b] transition-colors">
                      {range.label}
                    </span>
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="Danh mục">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-3 cursor-pointer group/item"
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategory === category.slug}
                        onChange={(e) =>
                          handleCategoryChange(category.slug, e.target.checked)
                        }
                        className="peer appearance-none size-5 border-2 border-[#ccc] dark:border-white/20 rounded-md checked:bg-[#13ec5b] checked:border-[#13ec5b] transition-all"
                      />
                      <CheckCircle
                        size={12}
                        className="absolute left-1 text-[#0d1b12] opacity-0 peer-checked:opacity-100 transition-opacity"
                      />
                    </div>
                    <span className="typo-body-sm text-[#4c9a66] dark:text-white/60 group-hover/item:text-[#13ec5b] transition-colors">
                      {category.name}
                    </span>
                  </label>
                ))}
              </FilterSection>
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
              <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                {/* View mode toggle */}
                <div className="flex items-center gap-1 bg-[#e7f3eb] dark:bg-white/5 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white dark:bg-white/10 shadow-sm text-[#13ec5b]" : "text-[#4c9a66] dark:text-white/40 hover:text-[#0d1b12] dark:hover:text-white"}`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white dark:bg-white/10 shadow-sm text-[#13ec5b]" : "text-[#4c9a66] dark:text-white/40 hover:text-[#0d1b12] dark:hover:text-white"}`}
                  >
                    <List size={18} />
                  </button>
                </div>

                {/* Search */}
                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-1 bg-white dark:bg-white/5 px-3 py-2 rounded-xl border border-[#e7f3eb] dark:border-white/10"
                >
                  <Search size={16} className="text-[#4c9a66]" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-[#0d1b12] dark:text-white placeholder:text-[#4c9a66] dark:placeholder:text-white/40 text-sm min-w-40"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#13ec5b] text-[#0d1b12] rounded-lg font-semibold hover:bg-[#13ec5b]/90 transition-colors text-xs"
                  >
                    Tìm
                  </button>
                </form>

                {/* Sort */}
                <div className="flex-1 md:flex-none bg-white dark:bg-white/5 p-2 px-4 rounded-xl border border-[#e7f3eb] dark:border-white/10 flex items-center gap-3 min-w-50">
                  <span className="typo-caption-xs text-[#4c9a66] whitespace-nowrap">
                    Sắp xếp:
                  </span>
                  <select
                    value={sort}
                    onChange={(e) => handleSort(e.target.value)}
                    className="bg-transparent border-none typo-body-sm font-bold text-[#0d1b12] dark:text-white focus:ring-0 p-0 cursor-pointer w-full outline-none"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="price-asc">Giá (thấp → cao)</option>
                    <option value="price-desc">Giá (cao → thấp)</option>
                  </select>
                </div>

                {/* Clear filters */}
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-[#e7f3eb] dark:border-white/10 rounded-xl text-[#0d1b12] dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all typo-body-sm font-bold"
                  >
                    <X size={16} />
                    <span>Xóa lọc</span>
                  </button>
                )}
              </div>
            </div>

            {/* Product grid — mờ nhẹ khi đang refetch, không block UI */}
            <div
              className={`transition-opacity duration-200 ${fetching ? "opacity-60 pointer-events-none" : "opacity-100"}`}
            >
              {products.length > 0 ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10"
                      : "space-y-4"
                  }
                >
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="typo-body text-[#4c9a66] dark:text-white/60">
                    Không tìm thấy sản phẩm nào
                  </p>
                </div>
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

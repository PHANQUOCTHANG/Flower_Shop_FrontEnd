"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, CheckCircle, LayoutGrid, List, Search } from "lucide-react";
import { useProducts } from "@/features/products/hooks/useProducts";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FilterSection } from "@/features/products/components/FilterSection";
import { ProductCard } from "@/features/products/components/ProductCard";
import { useCategories } from "@/features/products/hooks/useCategories";
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

export default function FlowerCollection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy params từ URL
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const minPrice = searchParams.get("minPrice")
    ? parseInt(searchParams.get("minPrice") || "0")
    : null;
  const maxPrice = searchParams.get("maxPrice")
    ? parseInt(searchParams.get("maxPrice") || "0")
    : null;
  const selectedCategories = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const searchQuery = searchParams.get("search") || "";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchInput, setSearchInput] = useState(searchQuery);

  // hooks
  const {
    products, 
    loading: productsLoading,
    totalPages = 1,
  } = useProducts({
    page: currentPage,
    search: searchQuery || undefined,
    priceMin: minPrice,
    priceMax: maxPrice,
    category: selectedCategories || undefined,
    sort,
  });

  const { categories, loading: categoriesLoading } = useCategories({
    limit: 6,
  });

  // Helper function để tạo URL params
  const createQueryString = (
    params: Record<string, string | number | string[] | null>,
  ) => {
    const newParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => newParams.append(key, String(v)));
      } else if (value !== undefined && value !== null) {
        newParams.set(key, String(value));
      }
    });

    return `?${newParams.toString()}`;
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params: Record<string, string | number | string[] | null> = { page };
    if (minPrice !== null) {
      params.minPrice = minPrice;
    }
    if (maxPrice !== null) {
      params.maxPrice = maxPrice;
    }
    if (selectedCategories) {
      params.category = selectedCategories;
    }
    params.sort = sort;
    if (searchQuery) {
      params.search = searchQuery;
    }
    router.push(`/products${createQueryString(params)}`);
  };

  // Handle price filter
  const handlePriceChange = (minVal: number | null, maxVal: number | null) => {
    const params: Record<string, string | number | string[] | null> = {
      page: 1,
    };
    if (minVal !== null) {
      params.minPrice = minVal;
    }
    if (maxVal !== null) {
      params.maxPrice = maxVal;
    }
    if (selectedCategories) {
      params.category = selectedCategories;
    }
    params.sort = sort;
    if (searchQuery) {
      params.search = searchQuery;
    }
    router.push(`/products${createQueryString(params)}`);
  };

  // Handle category filter
  const handleCategoryChange = (slug: string, isChecked: boolean) => {
    let newCategory = "";
    if (isChecked) {
      // Only allow one category selection
      newCategory = slug;
    }
    // If unchecked, newCategory stays empty

    const params: Record<string, string | number | string[] | null> = {
      page: 1,
    };
    if (minPrice !== null) {
      params.minPrice = minPrice;
    }
    if (maxPrice !== null) {
      params.maxPrice = maxPrice;
    }
    if (newCategory) {
      params.category = newCategory;
    }
    params.sort = sort;
    if (searchQuery) {
      params.search = searchQuery;
    }
    router.push(`/products${createQueryString(params)}`);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params: Record<string, string | number | string[] | null> = {
      page: 1,
    };
    if (searchInput.trim()) {
      params.search = searchInput;
    }
    if (minPrice !== null) {
      params.minPrice = minPrice;
    }
    if (maxPrice !== null) {
      params.maxPrice = maxPrice;
    }
    if (selectedCategories) {
      params.category = selectedCategories;
    }
    params.sort = sort;
    router.push(`/products${createQueryString(params)}`);
  };

  // Handle sort
  const handleSort = (sort: string) => {
    const params: Record<string, string | number | string[] | null> = {
      sort: sort,
      page: 1,
    };
    if (minPrice !== null) {
      params.minPrice = minPrice;
    }
    if (maxPrice !== null) {
      params.maxPrice = maxPrice;
    }
    if (selectedCategories) {
      params.category = selectedCategories;
    }
    if (searchQuery) {
      params.search = searchQuery;
    }
    router.push(`/products${createQueryString(params)}`);
  };

  if (productsLoading || categoriesLoading) return <Loading></Loading>;

  return (
    <div className="min-h-screen bg-[#fcfbf9] dark:bg-[#1a0f12] text-[#1b0d11] dark:text-white transition-colors duration-300 font-sans antialiased">
      <div className="max-w-360 mx-auto px-4 sm:px-10 lg:px-20 py-10">
        <Breadcrumbs
          items={[{ label: "Trang chủ", href: "/" }, { label: "Sản phẩm" }]}
        />

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Bộ lọc */}
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
                        checked={selectedCategories === category.slug}
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

          {/* Nội dung chính */}
          <div className="flex-1">
            {/* Header Danh mục */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
              <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                <div className="flex items-center gap-1 bg-[#e7f3eb] dark:bg-white/5 p-1 rounded-xl">
                  {/* Chế độ xem lưới */}
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-white dark:bg-white/10 shadow-sm text-[#13ec5b]"
                        : "text-[#4c9a66] dark:text-white/40 hover:text-[#0d1b12] dark:hover:text-white"
                    }`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  {/* Chế độ xem danh sách */}
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "list"
                        ? "bg-white dark:bg-white/10 shadow-sm text-[#13ec5b]"
                        : "text-[#4c9a66] dark:text-white/40 hover:text-[#0d1b12] dark:hover:text-white"
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>

                {/* Search Bar - Small inline */}
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

                <div className="flex-1 md:flex-none relative bg-white dark:bg-white/5 p-2 px-4 rounded-xl border border-[#e7f3eb] dark:border-white/10 flex items-center gap-3 min-w-50">
                  <span className="typo-caption-xs text-[#4c9a66] whitespace-nowrap">
                    Sắp xếp: 
                  </span>
                  <select
                    value={sort}
                    onChange={(e) => handleSort(e.target.value)}
                    className="bg-transparent border-none typo-body-sm font-bold text-[#0d1b12] dark:text-white focus:ring-0 p-0 cursor-pointer w-full outline-none"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="price-asc">Giá: Thấp đến Cao</option>
                    <option value="price-desc">Giá: Cao đến Thấp</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lưới sản phẩm */}
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

            {/* Phân trang */}
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

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  Filter,
  CheckCircle,
  LayoutGrid,
  List,
  Search,
} from "lucide-react";
import { useProducts } from "@/features/products/hooks/useProducts";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FilterSection } from "@/features/products/components/FilterSection";
import { ProductCard } from "@/features/products/components/ProductCard";
import { usePagination } from "@/features/products/hooks/usePagination";
import { useCategories } from "@/features/products/hooks/useCategories";
import { Loading } from "@/components/ui/Loading";

const PRICE_RANGES = [
  { label: "Dưới 500.000đ", min: 0, max: 500000 },
  { label: "500.000đ - 1.000.000đ", min: 500000, max: 1000000 },
  { label: "1.000.000đ - 2.000.000đ", min: 1000000, max: 2000000 },
  { label: "Trên 2.000.000đ", min: 2000000, max: Infinity },
];

export default function FlowerCollection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy params từ URL
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const selectedPriceRanges = searchParams.getAll("priceRange");
  const selectedCategories = searchParams.getAll("category");
  const sortBy = searchParams.get("sortBy") || "most-popular";
  const searchQuery = searchParams.get("search") || "";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchInput, setSearchInput] = useState(searchQuery);

  // hooks
  const { products, loading: productsLoading } = useProducts();

  const { categories, loading: categoriesLoading } = useCategories({
    limit: 6,
  });

  // Filter theo tìm kiếm
  const filterBySearch = (productList: typeof products) => {
    if (!searchQuery.trim()) return productList;

    return productList.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  // Filter theo giá
  const filterByPrice = (productList: typeof products) => {
    if (selectedPriceRanges.length === 0) return productList;

    return productList.filter((product) => {
      const price = parseInt(String(product.price));
      return selectedPriceRanges.some((range) => {
        const [min, max] = range.split("-").map(Number);
        return price >= min && price <= max;
      });
    });
  };

  // Filter theo danh mục
  const filterByCategory = (productList: typeof products) => {
    if (selectedCategories.length === 0) return productList;

    return productList.filter((product) => {
      return selectedCategories.some((categoryId) =>
        product.categories?.some((cat) => cat.id === categoryId),
      );
    });
  };

  // Sort products
  const sortProducts = (productList: typeof products) => {
    const sorted = [...productList];
    switch (sortBy) {
      case "price-asc":
        return sorted.sort(
          (a, b) => parseInt(String(a.price)) - parseInt(String(b.price)),
        );
      case "price-desc":
        return sorted.sort(
          (a, b) => parseInt(String(b.price)) - parseInt(String(a.price)),
        );
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case "most-popular":
      default:
        return sorted;
    }
  };

  // Apply filters
  let filteredProducts = filterBySearch(products);
  filteredProducts = filterByPrice(filteredProducts);
  filteredProducts = filterByCategory(filteredProducts);
  filteredProducts = sortProducts(filteredProducts);

  const { paginatedProducts, getPageNumbers, totalPages } = usePagination(
    filteredProducts,
    currentPage,
  );

  // Helper function để tạo URL params
  const createQueryString = (
    params: Record<string, string | number | string[]>,
  ) => {
    const newParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => newParams.append(key, String(v)));
      } else if (value !== undefined) {
        newParams.set(key, String(value));
      }
    });

    return `?${newParams.toString()}`;
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params: Record<string, string | number | string[]> = { page };
    if (selectedPriceRanges.length > 0) {
      params.priceRange = selectedPriceRanges;
    }
    if (selectedCategories.length > 0) {
      params.category = selectedCategories;
    }
    params.sortBy = sortBy;
    router.push(`/products${createQueryString(params)}`);
  };

  // Handle price filter
  const handlePriceChange = (range: string, isChecked: boolean) => {
    let newRanges = [...selectedPriceRanges];
    if (isChecked) {
      newRanges.push(range);
    } else {
      newRanges = newRanges.filter((r) => r !== range);
    }
    router.push(
      `/products${createQueryString({ priceRange: newRanges, category: selectedCategories, page: 1, sortBy })}`,
    );
  };

  // Handle category filter
  const handleCategoryChange = (categoryId: string, isChecked: boolean) => {
    let newCategories = [...selectedCategories];
    if (isChecked) {
      newCategories.push(categoryId);
    } else {
      newCategories = newCategories.filter((c) => c !== categoryId);
    }
    router.push(
      `/products${createQueryString({ priceRange: selectedPriceRanges, category: newCategories, page: 1, sortBy })}`,
    );
  };

  // Handle search
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params: Record<string, string | number | string[]> = { page: 1 };
    if (searchInput.trim()) {
      params.search = searchInput;
    }
    if (selectedPriceRanges.length > 0) {
      params.priceRange = selectedPriceRanges;
    }
    if (selectedCategories.length > 0) {
      params.category = selectedCategories;
    }
    params.sortBy = sortBy;
    router.push(`/products${createQueryString(params)}`);
  };

  // Handle sort
  const handleSort = (sort: string) => {
    const params: Record<string, string | number | string[]> = {
      sortBy: sort,
      page: 1,
    };
    if (selectedPriceRanges.length > 0) {
      params.priceRange = selectedPriceRanges;
    }
    if (selectedCategories.length > 0) {
      params.category = selectedCategories;
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
                    key={range.label}
                    className="flex items-center gap-3 cursor-pointer group/item"
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedPriceRanges.includes(
                          `${range.min}-${range.max}`,
                        )}
                        onChange={(e) =>
                          handlePriceChange(
                            `${range.min}-${range.max}`,
                            e.target.checked,
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
                        checked={selectedCategories.includes(category.id)}
                        onChange={(e) =>
                          handleCategoryChange(category.id, e.target.checked)
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

              <FilterSection title="Trạng thái hàng">
                <label className="flex items-center gap-3 cursor-pointer group/item">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer appearance-none size-5 border-2 border-[#ccc] dark:border-white/20 rounded-md checked:bg-[#13ec5b] checked:border-[#13ec5b] transition-all"
                    />
                    <CheckCircle
                      size={12}
                      className="absolute left-1 text-[#0d1b12] opacity-0 peer-checked:opacity-100 transition-opacity"
                    />
                  </div>
                  <span className="typo-body-sm text-[#4c9a66] dark:text-white/60 group-hover/item:text-[#13ec5b] transition-colors">
                    Còn hàng
                  </span>
                </label>
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
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value)}
                    className="bg-transparent border-none typo-body-sm font-bold text-[#0d1b12] dark:text-white focus:ring-0 p-0 cursor-pointer w-full outline-none"
                  >
                    <option value="most-popular">Được yêu thích</option>
                    <option value="price-asc">Giá: Thấp đến Cao</option>
                    <option value="price-desc">Giá: Cao đến Thấp</option>
                    <option value="newest">Mới nhất</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lưới sản phẩm */}
            {paginatedProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10"
                    : "space-y-4"
                }
              >
                {paginatedProducts.map((product) => (
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
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="size-12 rounded-full border-2 border-[#e7f3eb] dark:border-white/10 flex items-center justify-center text-[#4c9a66] dark:text-white/40 hover:border-[#13ec5b] hover:text-[#13ec5b] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-2">
                  {getPageNumbers().map((page, idx) => (
                    <button
                      key={`${page}-${idx}`}
                      onClick={() => {
                        if (typeof page === "number") {
                          handlePageChange(page);
                        }
                      }}
                      disabled={page === "..."}
                      className={`size-12 rounded-full typo-button-sm transition-all ${
                        page === currentPage
                          ? "bg-[#13ec5b] text-[#0d1b12] shadow-lg shadow-[#13ec5b]/30"
                          : page === "..."
                            ? "text-[#ccc] dark:text-white/20 cursor-default"
                            : "text-[#0d1b12] dark:text-white hover:bg-[#e7f3eb] dark:hover:bg-white/5 cursor-pointer"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="size-12 rounded-full border-2 border-[#e7f3eb] dark:border-white/10 flex items-center justify-center text-[#4c9a66] dark:text-white/40 hover:border-[#13ec5b] hover:text-[#13ec5b] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

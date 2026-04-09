"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Nhập components
import {
  FilterSidebar,
  ProductToolbar,
  ProductGrid,
} from "@/features/products/components";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Loading } from "@/components/ui/Loading";
import { Pagination } from "@/components/ui/Pagination";

// Nhập hooks
import { useProducts } from "@/features/products/hooks/useProducts";
import { useCategories } from "@/features/products/hooks/useCategories";

// Nhập utils & constants
import { buildQuery } from "@/features/products/utils/buildQuery";
import { PRODUCTS_CONFIG, type ViewMode } from "@/features/products/types";

// Component chính
export default function FlowerCollection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tham số từ URL
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const minPrice = searchParams.get("minPrice")
    ? parseInt(searchParams.get("minPrice")!)
    : null;
  const maxPrice = searchParams.get("maxPrice")
    ? parseInt(searchParams.get("maxPrice")!)
    : null;
  const selectedCategory = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || PRODUCTS_CONFIG.DEFAULT_SORT;
  const searchQuery = searchParams.get("search") || "";

  // Trạng thái cục bộ
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [viewMode, setViewMode] = useState<ViewMode>(
    PRODUCTS_CONFIG.DEFAULT_VIEW,
  );

  // Lấy dữ liệu
  const {
    products,
    loading: productsLoading,
    fetching,
    totalPages = 1,
  } = useProducts({
    page: currentPage,
    limit: PRODUCTS_CONFIG.ITEMS_PER_PAGE,
    search: searchQuery || undefined,
    priceMin: minPrice,
    priceMax: maxPrice,
    category: selectedCategory || undefined,
    sort,
  });

  const { categories, loading: categoriesLoading } = useCategories({
    limit: PRODUCTS_CONFIG.CATEGORIES_LIMIT,
  });

  // Trạng thái dẫn xuất
  const hasActiveFilters = useMemo(
    () =>
      minPrice !== null ||
      maxPrice !== null ||
      selectedCategory !== "" ||
      sort !== PRODUCTS_CONFIG.DEFAULT_SORT ||
      searchQuery !== "",
    [minPrice, maxPrice, selectedCategory, sort, searchQuery],
  );

  // Xử lý sự kiện
  // Helper chuyển hướng - giữ lại filter hiện tại, chỉ thay đổi phần cần
  const navigate = useCallback(
    (overrides: Record<string, string | number | null | undefined>) => {
      const base: Record<string, string | number | null | undefined> = {
        page: currentPage,
        minPrice,
        maxPrice,
        category: selectedCategory || null,
        sort: sort !== PRODUCTS_CONFIG.DEFAULT_SORT ? sort : null,
        search: searchQuery || null,
      };
      // Page reset về 1 khi đổi filter
      const merged = { ...base, page: 1, ...overrides };
      router.push(`${PRODUCTS_CONFIG.ROUTE}${buildQuery(merged)}`);
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

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    navigate({ page });
  };

  // Xử lý lọc theo giá
  const handlePriceChange = (minVal: number | null, maxVal: number | null) => {
    navigate({ minPrice: minVal, maxPrice: maxVal });
  };

  // Xử lý lọc theo danh mục
  const handleCategoryChange = (slug: string, isChecked: boolean) => {
    navigate({ category: isChecked ? slug : null });
  };

  // Xử lý sắp xếp
  const handleSort = (newSort: string) => {
    navigate({
      sort: newSort !== PRODUCTS_CONFIG.DEFAULT_SORT ? newSort : null,
    });
  };

  // Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate({ search: searchInput.trim() || null });
  };

  // Xóa tất cả lọc
  const handleClearFilters = () => {
    setSearchInput("");
    router.push(PRODUCTS_CONFIG.ROUTE);
  };

  // Trạng thái tải
  if (productsLoading || categoriesLoading) return <Loading />;

  // Hiển thị
  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1b0d11] transition-colors duration-300 font-sans antialiased">
      <main className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-6 sm:py-8 md:py-10 lg:py-10">
        {/* Điều hướng breadcrumb */}
        <Breadcrumbs
          items={[{ label: "Trang chủ", href: "/" }, { label: "Sản phẩm" }]}
        />

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {/* Sidebar lọc */}
          <FilterSidebar
            minPrice={minPrice}
            maxPrice={maxPrice}
            selectedCategory={selectedCategory}
            categories={categories}
            onPriceChange={handlePriceChange}
            onCategoryChange={handleCategoryChange}
          />

          {/* Nội dung chính */}
          <div className="flex-1">
            {/* Toolbar - tìm kiếm, sắp xếp, chế độ xem, xóa */}
            <ProductToolbar
              viewMode={viewMode}
              searchInput={searchInput}
              sort={sort}
              hasActiveFilters={hasActiveFilters}
              onViewModeChange={setViewMode}
              onSearchChange={setSearchInput}
              onSearch={handleSearch}
              onSortChange={handleSort}
              onClearFilters={handleClearFilters}
            />

            {/* Lưới sản phẩm */}
            <ProductGrid
              products={products}
              viewMode={viewMode}
              fetching={fetching}
            />

            {/* Phân trang */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

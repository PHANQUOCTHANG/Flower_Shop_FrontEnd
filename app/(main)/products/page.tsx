"use client";

import {
  useState,
  useCallback,
  useMemo,
  Suspense,
  useEffect,
  useRef,
} from "react";
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
function FlowerCollectionContent() {
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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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

  const { categories, loading: categoriesLoading } = useCategories();

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

  // Debounce search onChange - tự động tìm kiếm sau khi người dùng dừng gõ
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);

      // Xóa timeout cũ
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Thiết lập timeout mới
      debounceTimerRef.current = setTimeout(() => {
        navigate({ search: value.trim() || null });
      }, 500); // 500ms debounce
    },
    [navigate],
  );

  // Cleanup timeout khi unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Xóa tất cả lọc
  const handleClearFilters = () => {
    setSearchInput("");
    router.push(PRODUCTS_CONFIG.ROUTE);
  };

  // Trạng thái tải
  if (productsLoading || categoriesLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1b0d11] transition-colors duration-300 font-sans antialiased">
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 lg:py-10">
        {/* Điều hướng breadcrumb */}
        <div className="mb-4 sm:mb-6">
          <Breadcrumbs
            items={[{ label: "Trang chủ", href: "/" }, { label: "Sản phẩm" }]}
          />
        </div>

        {/* Page Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0d1b12] tracking-tight mb-3">
            Tất cả sản phẩm
          </h1>
          <p className="text-[#4c9a66] text-sm sm:text-base max-w-2xl">
            Khám phá bộ sưu tập hoa tươi và quà tặng độc đáo. Mỗi sản phẩm đều
            được chăm chút tỉ mỉ để mang đến những khoảnh khắc tuyệt vời nhất.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {/* Sidebar lọc */}
          <FilterSidebar
            minPrice={minPrice}
            maxPrice={maxPrice}
            selectedCategory={selectedCategory}
            categories={categories}
            onPriceChange={handlePriceChange}
            onCategoryChange={handleCategoryChange}
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
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
              onSearchChange={handleSearchChange}
              onSortChange={handleSort}
              onClearFilters={handleClearFilters}
              onOpenFilter={() => setIsMobileFilterOpen(true)}
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

export default function FlowerCollection() {
  return (
    <Suspense fallback={<Loading />}>
      <FlowerCollectionContent />
    </Suspense>
  );
}

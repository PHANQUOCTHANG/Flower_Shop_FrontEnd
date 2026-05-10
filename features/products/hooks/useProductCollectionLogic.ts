import { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useCategories } from "@/features/products/hooks/useCategories";
import { buildQuery } from "@/features/products/utils/buildQuery";
import { PRODUCTS_CONFIG, type ViewMode } from "@/features/products/types";

export function useProductCollectionLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Lấy tham số từ URL (URL Params) ---
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

  // --- Trạng thái cục bộ (Local State) ---
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [viewMode, setViewMode] = useState<ViewMode>(PRODUCTS_CONFIG.DEFAULT_VIEW);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // --- Gọi API lấy dữ liệu (Fetch Data) ---
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

  // --- Trạng thái dẫn xuất (Derived State) ---
  const hasActiveFilters = useMemo(
    () =>
      minPrice !== null ||
      maxPrice !== null ||
      selectedCategory !== "" ||
      sort !== PRODUCTS_CONFIG.DEFAULT_SORT ||
      searchQuery !== "",
    [minPrice, maxPrice, selectedCategory, sort, searchQuery],
  );

  // --- Các hàm xử lý (Handlers) ---

  // Hàm helper dùng để chuyển hướng, giữ nguyên bộ lọc hiện tại
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
      // Reset trang về 1 mỗi khi thay đổi bộ lọc
      const merged = { ...base, page: 1, ...overrides };
      router.push(`${PRODUCTS_CONFIG.ROUTE}${buildQuery(merged)}`);
    },
    [currentPage, minPrice, maxPrice, selectedCategory, sort, searchQuery, router],
  );

  // Xử lý chuyển trang
  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;
      navigate({ page });
    },
    [totalPages, navigate],
  );

  // Xử lý lọc theo giá
  const handlePriceChange = useCallback(
    (minVal: number | null, maxVal: number | null) => {
      navigate({ minPrice: minVal, maxPrice: maxVal });
    },
    [navigate],
  );

  // Xử lý lọc theo danh mục
  const handleCategoryChange = useCallback(
    (slug: string, isChecked: boolean) => {
      navigate({ category: isChecked ? slug : null });
    },
    [navigate],
  );

  // Xử lý sắp xếp sản phẩm
  const handleSort = useCallback(
    (newSort: string) => {
      navigate({
        sort: newSort !== PRODUCTS_CONFIG.DEFAULT_SORT ? newSort : null,
      });
    },
    [navigate],
  );

  // Xử lý tìm kiếm (có sử dụng debounce để giảm tải API)
  const debouncedNavigate = useDebouncedCallback((value: string) => {
    navigate({ search: value.trim() || null });
  }, 500);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      debouncedNavigate(value);
    },
    [debouncedNavigate],
  );

  // Xóa toàn bộ bộ lọc
  const handleClearFilters = useCallback(() => {
    setSearchInput("");
    router.push(PRODUCTS_CONFIG.ROUTE);
  }, [router]);

  return {
    state: {
      currentPage,
      minPrice,
      maxPrice,
      selectedCategory,
      sort,
      searchInput,
      viewMode,
      isMobileFilterOpen,
      products,
      productsLoading,
      fetching,
      totalPages,
      categories,
      categoriesLoading,
      hasActiveFilters,
    },
    actions: {
      setViewMode,
      setIsMobileFilterOpen,
      handlePageChange,
      handlePriceChange,
      handleCategoryChange,
      handleSort,
      handleSearchChange,
      handleClearFilters,
    },
  };
}

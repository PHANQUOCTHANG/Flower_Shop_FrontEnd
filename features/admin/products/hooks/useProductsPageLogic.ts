import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useProducts,
  useDeleteProduct,
} from "@/features/admin/products/hooks/useProducts";
import { useCategories } from "@/features/admin/products/hooks/useCategories";
import {
  parseQueryParams,
  buildQueryParams,
  hasActiveFilters,
  normalizeCategoryValue,
} from "@/features/admin/products/utils/filterHelpers";
import { Product } from "@/features/admin/products/types";
import {
  PRODUCT_CONFIG,
  FILTER_DEFAULTS,
} from "@/features/admin/products/constants/productConfig";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

export function useProductsPageLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Thử lọc chưa áp dụng
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [sortBy, setSortBy] = useState<string>(FILTER_DEFAULTS.SORT_NEWEST);
  const [statusFilter, setStatusFilter] = useState<string>(
    FILTER_DEFAULTS.STATUS_ALL
  );
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // Bộ lọc đã áp dụng
  const [appliedSearchKeyword, setAppliedSearchKeyword] = useState("");
  const [appliedCategory, setAppliedCategory] = useState<string | undefined>(
    undefined
  );
  const [appliedSortBy, setAppliedSortBy] = useState<string>(
    FILTER_DEFAULTS.SORT_NEWEST
  );
  const [appliedStatusFilter, setAppliedStatusFilter] = useState<string>(
    FILTER_DEFAULTS.STATUS_ALL
  );
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);

  // Phân trang và UI state
  const [currentPage, setCurrentPage] = useState<number>(
    FILTER_DEFAULTS.PAGE_DEFAULT
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProductForDelete, setSelectedProductForDelete] =
    useState<Product | null>(null);

  // Lấy dữ liệu sản phẩm và danh mục
  const {
    products,
    loading: productsLoading,
    meta,
    fetching,
    totalPages = 1,
  } = useProducts({
    search: appliedSearchKeyword,
    category: appliedCategory,
    sort:
      appliedSortBy === FILTER_DEFAULTS.SORT_NEWEST ? undefined : appliedSortBy,
    status: appliedStatusFilter,
    priceMin: appliedMinPrice,
    priceMax: appliedMaxPrice,
    page: currentPage,
    limit: PRODUCT_CONFIG.ITEMS_PER_PAGE,
  });

  const { categories, loading: categoriesLoading } = useCategories();

  // Xóa sản phẩm - mutation
  const { deleteProduct, isPending: isDeleting } = useDeleteProduct();

  // Cập nhật URL query parameters từ filter state
  const updateQueryParams = useCallback(
    (
      keyword: string,
      category: string | undefined,
      page: number,
      sort: string,
      minPriceParam: number | null,
      maxPriceParam: number | null,
      statusParam: string
    ) => {
      const params = buildQueryParams({
        search: keyword,
        category,
        page,
        sort,
        status: statusParam,
        minPrice: minPriceParam,
        maxPrice: maxPriceParam,
      });

      const qs = params.toString();
      router.push(qs ? `?${qs}` : "/admin/products");
    },
    [router]
  );

  // Khởi tạo filter từ URL params
  useEffect(() => {
    const { keyword, category, page, sort, status, minPrice, maxPrice } =
      parseQueryParams(searchParams);

    setSearchKeyword(keyword);
    setSelectedCategory(category);
    setCurrentPage(page);
    setSortBy(sort as string);
    setStatusFilter(status as string);
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);

    setAppliedSearchKeyword(keyword);
    setAppliedCategory(category);
    setAppliedSortBy(sort as string);
    setAppliedStatusFilter(status as string);
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
  }, [searchParams]);

  // Áp dụng tìm kiếm với debounce
  const debouncedSearchApply = useDebouncedCallback((keyword: string) => {
    setAppliedSearchKeyword(keyword);
    setCurrentPage(FILTER_DEFAULTS.PAGE_DEFAULT);

    updateQueryParams(
      keyword,
      appliedCategory,
      FILTER_DEFAULTS.PAGE_DEFAULT,
      appliedSortBy,
      appliedMinPrice,
      appliedMaxPrice,
      appliedStatusFilter
    );
  }, 500);

  // Xử lý thay đổi search keyword
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const keyword = e.target.value;
      setSearchKeyword(keyword);
      debouncedSearchApply(keyword);
    },
    [debouncedSearchApply]
  );

  // Xử lý thay đổi category
  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedCategory(normalizeCategoryValue(e.target.value));
    },
    []
  );

  // Xử lý thay đổi sort
  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const sort = e.target.value;
      setSortBy(sort);
      setAppliedSortBy(sort);
      setCurrentPage(FILTER_DEFAULTS.PAGE_DEFAULT);
      updateQueryParams(
        appliedSearchKeyword,
        appliedCategory,
        FILTER_DEFAULTS.PAGE_DEFAULT,
        sort,
        appliedMinPrice,
        appliedMaxPrice,
        appliedStatusFilter
      );
    },
    [
      appliedSearchKeyword,
      appliedCategory,
      appliedMinPrice,
      appliedMaxPrice,
      appliedStatusFilter,
      updateQueryParams,
    ]
  );

  // Xử lý thay đổi status filter
  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const statusVal = e.target.value;
      setStatusFilter(statusVal);
      setAppliedStatusFilter(statusVal);
      setCurrentPage(FILTER_DEFAULTS.PAGE_DEFAULT);
      updateQueryParams(
        appliedSearchKeyword,
        appliedCategory,
        FILTER_DEFAULTS.PAGE_DEFAULT,
        appliedSortBy,
        appliedMinPrice,
        appliedMaxPrice,
        statusVal
      );
    },
    [
      appliedSearchKeyword,
      appliedCategory,
      appliedSortBy,
      appliedMinPrice,
      appliedMaxPrice,
      updateQueryParams,
    ]
  );

  // Xử lý thay đổi price range
  const handlePriceRangeChange = useCallback(
    (minVal: number | null, maxVal: number | null) => {
      setMinPrice(minVal);
      setMaxPrice(maxVal);
    },
    []
  );

  // Xử lý thay đổi trang
  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);
      updateQueryParams(
        appliedSearchKeyword,
        appliedCategory,
        newPage,
        appliedSortBy,
        appliedMinPrice,
        appliedMaxPrice,
        appliedStatusFilter
      );
    },
    [
      appliedSearchKeyword,
      appliedCategory,
      appliedSortBy,
      appliedMinPrice,
      appliedMaxPrice,
      appliedStatusFilter,
      updateQueryParams,
    ]
  );

  // Xử lý áp dụng filters
  const handleApplyFilter = useCallback(() => {
    const normalizedCategory = normalizeCategoryValue(selectedCategory);

    setAppliedSearchKeyword(searchKeyword);
    setAppliedCategory(normalizedCategory);
    setAppliedSortBy(sortBy);
    setAppliedStatusFilter(statusFilter);
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
    setCurrentPage(FILTER_DEFAULTS.PAGE_DEFAULT);

    updateQueryParams(
      searchKeyword,
      normalizedCategory,
      FILTER_DEFAULTS.PAGE_DEFAULT,
      sortBy,
      minPrice,
      maxPrice,
      statusFilter
    );
  }, [
    selectedCategory,
    searchKeyword,
    sortBy,
    statusFilter,
    minPrice,
    maxPrice,
    updateQueryParams,
  ]);

  // Xử lý xóa tất cả filters
  const handleClearFilter = useCallback(() => {
    setSearchKeyword(FILTER_DEFAULTS.SEARCH_DEFAULT);
    setSelectedCategory(undefined);
    setSortBy(FILTER_DEFAULTS.SORT_NEWEST);
    setStatusFilter(FILTER_DEFAULTS.STATUS_ALL);
    setMinPrice(null);
    setMaxPrice(null);
    setAppliedSearchKeyword(FILTER_DEFAULTS.SEARCH_DEFAULT);
    setAppliedCategory(undefined);
    setAppliedSortBy(FILTER_DEFAULTS.SORT_NEWEST);
    setAppliedStatusFilter(FILTER_DEFAULTS.STATUS_ALL);
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);
    setCurrentPage(FILTER_DEFAULTS.PAGE_DEFAULT);
    router.push("/admin/products");
  }, [router]);

  // Mở dialog xác nhận xóa
  const handleOpenDeleteDialog = useCallback((product: Product) => {
    setSelectedProductForDelete(product);
    setIsDeleteDialogOpen(true);
  }, []);

  // Đóng dialog xác nhận xóa
  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedProductForDelete(null);
  }, []);

  // Xác nhận xóa sản phẩm
  const handleConfirmDelete = useCallback(() => {
    if (!selectedProductForDelete) return;
    deleteProduct(selectedProductForDelete.id, {
      onSuccess: () => handleCloseDeleteDialog(),
    });
  }, [selectedProductForDelete, deleteProduct, handleCloseDeleteDialog]);

  // Kiểm tra có filter nào được áp dụng không
  const isFiltersActive = hasActiveFilters({
    search: appliedSearchKeyword,
    category: appliedCategory,
    sort: appliedSortBy,
    status: appliedStatusFilter,
    minPrice: appliedMinPrice,
    maxPrice: appliedMaxPrice,
  });

  return {
    state: {
      searchKeyword,
      selectedCategory,
      sortBy,
      statusFilter,
      minPrice,
      maxPrice,
      currentPage,
      isDeleteDialogOpen,
      selectedProductForDelete,
      products,
      productsLoading,
      categoriesLoading,
      meta,
      fetching,
      totalPages,
      categories,
      isDeleting,
      isFiltersActive,
    },
    actions: {
      handleSearchChange,
      handleCategoryChange,
      handleSortChange,
      handleStatusChange,
      handlePriceRangeChange,
      handlePageChange,
      handleApplyFilter,
      handleClearFilter,
      handleOpenDeleteDialog,
      handleCloseDeleteDialog,
      handleConfirmDelete,
    },
  };
}

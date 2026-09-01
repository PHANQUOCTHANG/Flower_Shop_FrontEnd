import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useTrashProducts,
  useHardDeleteProduct,
  useRestoreProduct,
} from "@/features/admin/products/hooks/useProducts";
import { useCategories } from "@/features/admin/categories/hooks/useCategories";
import {
  parseQueryParams,
  buildQueryParams,
  hasActiveFilters,
  normalizeCategoryValue,
} from "@/features/admin/products/utils/filterHelpers";
import { Product } from "@/features/admin/products/types";
import { FILTER_DEFAULTS } from "@/features/admin/products/constants/productConfig";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

// Trang thùng rác dùng lại toàn bộ máy lọc (search/category/giá/sắp xếp) của
// trang quản lý sản phẩm — chỉ bỏ bộ lọc trạng thái vì mọi sản phẩm ở đây đều
// đã bị xóa mềm, và thay hành động xóa mềm bằng xóa vĩnh viễn + khôi phục.
export function useTrashProductsPageLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Thử lọc chưa áp dụng
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [sortBy, setSortBy] = useState<string>(FILTER_DEFAULTS.SORT_NEWEST);
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
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);

  // Phân trang và UI state
  const [currentPage, setCurrentPage] = useState<number>(
    FILTER_DEFAULTS.PAGE_DEFAULT
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProductForDelete, setSelectedProductForDelete] =
    useState<Product | null>(null);

  // Lấy dữ liệu sản phẩm trong thùng rác và danh mục
  const {
    products,
    loading: productsLoading,
    meta,
    fetching,
    totalPages = 1,
  } = useTrashProducts({
    search: appliedSearchKeyword,
    category: appliedCategory,
    sort:
      appliedSortBy === FILTER_DEFAULTS.SORT_NEWEST ? undefined : appliedSortBy,
    priceMin: appliedMinPrice,
    priceMax: appliedMaxPrice,
    page: currentPage,
    limit: 10,
  });

  const { categories, loading: categoriesLoading } = useCategories();

  // Xóa vĩnh viễn & khôi phục - mutations
  const { hardDeleteProduct, isPending: isDeleting } = useHardDeleteProduct();
  const { restoreProduct, isPending: isRestoring } = useRestoreProduct();

  // Cập nhật URL query parameters từ filter state
  const updateQueryParams = useCallback(
    (
      keyword: string,
      category: string | undefined,
      page: number,
      sort: string,
      minPriceParam: number | null,
      maxPriceParam: number | null
    ) => {
      const params = buildQueryParams({
        search: keyword,
        category,
        page,
        sort,
        status: FILTER_DEFAULTS.STATUS_ALL,
        minPrice: minPriceParam,
        maxPrice: maxPriceParam,
      });

      const qs = params.toString();
      router.push(qs ? `?${qs}` : "/admin/products/trash");
    },
    [router]
  );

  // Khởi tạo filter từ URL params
  useEffect(() => {
    const { keyword, category, page, sort, minPrice, maxPrice } =
      parseQueryParams(searchParams);

    setSearchKeyword(keyword);
    setSelectedCategory(category);
    setCurrentPage(page);
    setSortBy(sort as string);
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);

    setAppliedSearchKeyword(keyword);
    setAppliedCategory(category);
    setAppliedSortBy(sort as string);
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
      appliedMaxPrice
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
        appliedMaxPrice
      );
    },
    [
      appliedSearchKeyword,
      appliedCategory,
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
        appliedMaxPrice
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

  // Xử lý áp dụng filters
  const handleApplyFilter = useCallback(() => {
    const normalizedCategory = normalizeCategoryValue(selectedCategory);

    setAppliedSearchKeyword(searchKeyword);
    setAppliedCategory(normalizedCategory);
    setAppliedSortBy(sortBy);
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
    setCurrentPage(FILTER_DEFAULTS.PAGE_DEFAULT);

    updateQueryParams(
      searchKeyword,
      normalizedCategory,
      FILTER_DEFAULTS.PAGE_DEFAULT,
      sortBy,
      minPrice,
      maxPrice
    );
  }, [selectedCategory, searchKeyword, sortBy, minPrice, maxPrice, updateQueryParams]);

  // Xử lý xóa tất cả filters
  const handleClearFilter = useCallback(() => {
    setSearchKeyword(FILTER_DEFAULTS.SEARCH_DEFAULT);
    setSelectedCategory(undefined);
    setSortBy(FILTER_DEFAULTS.SORT_NEWEST);
    setMinPrice(null);
    setMaxPrice(null);
    setAppliedSearchKeyword(FILTER_DEFAULTS.SEARCH_DEFAULT);
    setAppliedCategory(undefined);
    setAppliedSortBy(FILTER_DEFAULTS.SORT_NEWEST);
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);
    setCurrentPage(FILTER_DEFAULTS.PAGE_DEFAULT);
    router.push("/admin/products/trash");
  }, [router]);

  // Mở dialog xác nhận xóa vĩnh viễn
  const handleOpenDeleteDialog = useCallback((product: Product) => {
    setSelectedProductForDelete(product);
    setIsDeleteDialogOpen(true);
  }, []);

  // Đóng dialog xác nhận xóa vĩnh viễn
  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedProductForDelete(null);
  }, []);

  // Xác nhận xóa vĩnh viễn sản phẩm
  const handleConfirmDelete = useCallback(() => {
    if (!selectedProductForDelete) return;
    hardDeleteProduct(selectedProductForDelete.id, {
      onSuccess: () => handleCloseDeleteDialog(),
    });
  }, [selectedProductForDelete, hardDeleteProduct, handleCloseDeleteDialog]);

  // Khôi phục sản phẩm về danh sách quản lý
  const handleRestore = useCallback(
    (product: Product) => {
      restoreProduct(product.id);
    },
    [restoreProduct]
  );

  // Kiểm tra có filter nào được áp dụng không
  const isFiltersActive = hasActiveFilters({
    search: appliedSearchKeyword,
    category: appliedCategory,
    sort: appliedSortBy,
    status: FILTER_DEFAULTS.STATUS_ALL,
    minPrice: appliedMinPrice,
    maxPrice: appliedMaxPrice,
  });

  return {
    state: {
      searchKeyword,
      selectedCategory,
      sortBy,
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
      isRestoring,
      isFiltersActive,
    },
    actions: {
      handleSearchChange,
      handleCategoryChange,
      handleSortChange,
      handlePriceRangeChange,
      handlePageChange,
      handleApplyFilter,
      handleClearFilter,
      handleOpenDeleteDialog,
      handleCloseDeleteDialog,
      handleConfirmDelete,
      handleRestore,
    },
  };
}

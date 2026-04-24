"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loading } from "@/components/ui/Loading";
import { DeleteConfirmDialog } from "@/components/ui/admin/DeleteConfirmDialog";

// Components
import {
  FilterBar,
  ProductTable,
  ProductStats,
  ProductPageHeader,
} from "@/features/admin/products/components";

// Hooks
import {
  useProducts,
  useDeleteProduct,
} from "@/features/admin/products/hooks/useProducts";
import { useCategories } from "@/features/admin/products/hooks/useCategories";

// Utils & helpers
import {
  parseQueryParams,
  buildQueryParams,
  hasActiveFilters,
  normalizeCategoryValue,
} from "@/features/admin/products/utils/filterHelpers";

// Types & constants
import { Product } from "@/features/admin/products/types";
import {
  PRODUCT_CONFIG,
  PRODUCT_PRICE_RANGES,
  FILTER_DEFAULTS,
} from "@/features/admin/products/constants/productConfig";

// Trang danh sách sản phẩm

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Thử lọc chưa áp dụng
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );
  const [sortBy, setSortBy] = useState<string>(FILTER_DEFAULTS.SORT_NEWEST);
  const [statusFilter, setStatusFilter] = useState<string>(FILTER_DEFAULTS.STATUS_ALL);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // Bộ lọc đã áp dụng
  const [appliedSearchKeyword, setAppliedSearchKeyword] = useState("");
  const [appliedCategory, setAppliedCategory] = useState<string | undefined>(
    undefined,
  );
  const [appliedSortBy, setAppliedSortBy] = useState<string>(
    FILTER_DEFAULTS.SORT_NEWEST,
  );
  const [appliedStatusFilter, setAppliedStatusFilter] = useState<string>(
    FILTER_DEFAULTS.STATUS_ALL,
  );
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);

  // Phân trang và UI state
  const [currentPage, setCurrentPage] = useState<number>(FILTER_DEFAULTS.PAGE_DEFAULT);
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

  console.log(products);
  const { categories, loading: categoriesLoading } = useCategories();

  // Xóa sản phẩm - mutation
  const { deleteProduct, isPending: isDeleting } = useDeleteProduct();

  // Quản lý URL query parameters

  // Cập nhật URL query parameters từ filter state
  const updateQueryParams = useCallback(
    (
      keyword: string,
      category: string | undefined,
      page: number,
      sort: string,
      minPriceParam: number | null,
      maxPriceParam: number | null,
      statusParam: string,
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
    [router],
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

  // Các hàm xử lý

  // Xử lý thay đổi search keyword
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  // Xử lý thay đổi category
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(normalizeCategoryValue(e.target.value));
  };

  // Xử lý thay đổi sort
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
      appliedStatusFilter,
    );
  };

  // Xử lý thay đổi status filter
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
      statusVal,
    );
  };

  // Xử lý thay đổi price range
  const handlePriceRangeChange = (
    minVal: number | null,
    maxVal: number | null,
  ) => {
    setMinPrice(minVal);
    setMaxPrice(maxVal);
  };

  // Xử lý thay đổi trang
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateQueryParams(
      appliedSearchKeyword,
      appliedCategory,
      newPage,
      appliedSortBy,
      appliedMinPrice,
      appliedMaxPrice,
      appliedStatusFilter,
    );
  };

  // Xử lý áp dụng filters
  const handleApplyFilter = () => {
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
      statusFilter,
    );
  };

  // Xử lý xóa tất cả filters
  const handleClearFilter = () => {
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
  };

  // Xóa sản phẩm - các hàm liên quan

  // Mở dialog xác nhận xóa
  const handleOpenDeleteDialog = (product: Product) => {
    setSelectedProductForDelete(product);
    setIsDeleteDialogOpen(true);
  };

  // Đóng dialog xác nhận xóa
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProductForDelete(null);
  };

  // Xác nhận xóa sản phẩm
  const handleConfirmDelete = () => {
    if (!selectedProductForDelete) return;
    deleteProduct(selectedProductForDelete.id, {
      onSuccess: () => handleCloseDeleteDialog(),
    });
  };

  // Derived state

  // Kiểm tra có filter nào được áp dụng không
  const isFiltersActive = hasActiveFilters({
    search: appliedSearchKeyword,
    category: appliedCategory,
    sort: appliedSortBy,
    status: appliedStatusFilter,
    minPrice: appliedMinPrice,
    maxPrice: appliedMaxPrice,
  });

  // Loading state

  if (productsLoading || categoriesLoading) return <Loading />;

  // Render

  return (
    <>
      {/* Delete confirm dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm"
        itemName={selectedProductForDelete?.name || ""}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteDialog}
        isLoading={isDeleting}
      />

      <div className="flex flex-col min-h-screen overflow-auto bg-[#f6f8f6] font-['Inter',_sans-serif]">
        {/* Header */}
        <ProductPageHeader />

        {/* Main content */}
        <main className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-6 sm:gap-8 animate-in fade-in duration-500">
          {/* Filters */}
          <FilterBar
            searchKeyword={searchKeyword}
            selectedCategory={selectedCategory || FILTER_DEFAULTS.CATEGORY_ALL}
            selectedStatus={statusFilter}
            sortBy={sortBy}
            minPrice={minPrice}
            maxPrice={maxPrice}
            categories={categories}
            priceRanges={PRODUCT_PRICE_RANGES as any}
            hasActiveFilters={isFiltersActive}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
            onStatusChange={handleStatusChange}
            onSortChange={handleSortChange}
            onPriceRangeChange={handlePriceRangeChange}
            onApplyFilter={handleApplyFilter}
            onClearFilter={handleClearFilter}
          />

          {/* Product table */}
          <ProductTable
            products={products}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onDelete={handleOpenDeleteDialog}
            isLoading={fetching}
          />

          {/* Stats */}
          <ProductStats data={meta} />
        </main>
      </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProductsPageContent />
    </Suspense>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loading } from "@/components/ui/Loading";
import { DeleteConfirmDialog } from "@/components/ui/admin/DeleteConfirmDialog";
import {
  FilterBar,
  ProductTable,
  ProductStats,
  ProductPageHeader,
} from "@/features/admin/products/components";
import { useProducts } from "@/features/admin/products/hooks/useProducts";
import { useCategories } from "@/features/admin/products/hooks/useCategories";
import type { Product } from "@/features/admin/products/types";

// Dữ liệu sản phẩm - phù hợp với Prisma model
export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pending filters (chưa được áp dụng)
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState("newest");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // Applied filters (đã được áp dụng - dùng để filter sản phẩm)
  const [appliedSearchKeyword, setAppliedSearchKeyword] = useState("");
  const [appliedCategory, setAppliedCategory] = useState<string | undefined >(undefined);
  const [appliedSortBy, setAppliedSortBy] = useState("newest");
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);

  // Pagination & UI state
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // hooks
  const { products, loading: productsLoading , totalPages = 1 } = useProducts({
    search: appliedSearchKeyword,
    category: appliedCategory,
    sort: appliedSortBy,
    priceMin: appliedMinPrice,
    priceMax: appliedMaxPrice,
    page: currentPage,
  });

  const { categories, loading: categoriesLoading } = useCategories({
    limit: 6,
  });

  const [selectedProductForDelete, setSelectedProductForDelete] = useState<
    (typeof products)[0] | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Khởi tạo state từ URL query params
  useEffect(() => {
    const keyword = searchParams.get("search") || "";
    const category = searchParams.get("category") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const sort = searchParams.get("sort") || "newest";
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");

    const minPriceVal = minPriceParam ? parseInt(minPriceParam) : null;
    const maxPriceVal = maxPriceParam ? parseInt(maxPriceParam) : null;

    // Cập nhật cả pending và applied filters từ URL
    setSearchKeyword(keyword);
    setSelectedCategory(category);
    setCurrentPage(page);
    setSortBy(sort);
    setMinPrice(minPriceVal);
    setMaxPrice(maxPriceVal);

    // Applied filters cũng được set từ URL (vì URL là state của applied)
    setAppliedSearchKeyword(keyword);
    setAppliedCategory(category);
    setAppliedSortBy(sort);
    setAppliedMinPrice(minPriceVal);
    setAppliedMaxPrice(maxPriceVal);

    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams]);

  // Hàm cập nhật URL với query params
  const updateQueryParams = (
    keyword?: string,
    category?: string,
    page?: number,
    sort?: string,
    minPriceParam?: number | null,
    maxPriceParam?: number | null,
  ) => {
    const params = new URLSearchParams();

    if (keyword !== undefined) {
      if (keyword) params.set("search", keyword);
      setSearchKeyword(keyword);
    } else if (searchKeyword) {
      params.set("search", searchKeyword);
    }

    if (category !== undefined) {
      if (category !== "Tất cả") params.set("category", category);
      setSelectedCategory(category);
    } else if (selectedCategory !== "Tất cả") {
      params.set("category", selectedCategory);
    }

    const pageNum = page !== undefined ? page : currentPage;
    if (pageNum > 1) params.set("page", pageNum.toString());
    if (page !== undefined) setCurrentPage(pageNum);

    const sortValue = sort !== undefined ? sort : sortBy;
    if (sortValue !== "newest") params.set("sort", sortValue);
    if (sort !== undefined) setSortBy(sortValue);

    const minVal = minPriceParam !== undefined ? minPriceParam : minPrice;
    const maxVal = maxPriceParam !== undefined ? maxPriceParam : maxPrice;
    if (minVal !== null) params.set("minPrice", minVal?.toString());
    if (maxVal !== null) params.set("maxPrice", maxVal?.toString());
    if (minPriceParam !== undefined) setMinPrice(minPriceParam);
    if (maxPriceParam !== undefined) setMaxPrice(maxPriceParam);

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "/admin/products");
  };

  // Xử lý thay đổi tìm kiếm (không cập nhật URL ngay, chỉ cập nhật state)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
  };

  // Xử lý thay đổi danh mục (không cập nhật URL ngay, chỉ cập nhật state)
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
  };

  // Xử lý thay đổi sắp xếp (không cập nhật URL ngay, chỉ cập nhật state)
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value;
    setSortBy(sort);
  };

  // Xử lý thay đổi khung giá (không cập nhật URL ngay, chỉ cập nhật state)
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
    setIsLoading(true);
    updateQueryParams(
      appliedSearchKeyword,
      appliedCategory,
      newPage,
      appliedSortBy,
      appliedMinPrice,
      appliedMaxPrice,
    );
  };

  // Xử lý áp dụng lọc (copy pending filters → applied filters + update URL)
  const handleApplyFilter = () => {
    // Copy pending filters to applied filters
    setAppliedSearchKeyword(searchKeyword);
    setAppliedCategory(selectedCategory);
    setAppliedSortBy(sortBy);
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);

    // Reset page to 1
    setCurrentPage(1);
    setIsLoading(true);

    // Update URL with applied filters
    updateQueryParams(
      searchKeyword,
      selectedCategory,
      1,
      sortBy,
      minPrice,
      maxPrice,
    );
  };

  // Xử lý xóa lọc
  const handleClearFilter = () => {
    // Reset pending filters
    setSearchKeyword("");
    setSelectedCategory("Tất cả");
    setSortBy("newest");
    setMinPrice(null);
    setMaxPrice(null);

    // Reset applied filters
    setAppliedSearchKeyword("");
    setAppliedCategory("Tất cả");
    setAppliedSortBy("newest");
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);

    setCurrentPage(1);
    setIsLoading(true);
    router.push("/admin/products");
  };

  // Xử lý mở dialog xác nhận xóa
  const handleOpenDeleteDialog = (product: (typeof products)[0]) => {
    setSelectedProductForDelete(product);
    setIsDeleteDialogOpen(true);
  };

  // Xử lý đóng dialog xác nhận xóa
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProductForDelete(null);
  };

  // Xử lý xác nhận xóa sản phẩm
  const handleConfirmDelete = async () => {
    if (!selectedProductForDelete) return;

    setIsDeleting(true);
    try {
      // Simulate delete API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // TODO: Gọi API xóa sản phẩm từ backend
      console.log("Xóa sản phẩm:", selectedProductForDelete.id);

      handleCloseDeleteDialog();
      // TODO: Refresh danh sách sản phẩm sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Các khung giá cố định
  const getPriceRanges = () => [
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

  const priceRanges = getPriceRanges();

  if (productsLoading || categoriesLoading) return <Loading />;

  return (
    <>
      {isLoading && <Loading />}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm"
        itemName={selectedProductForDelete?.name || ""}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteDialog}
        isLoading={isDeleting}
      />
      <div className="flex flex-col h-full overflow-hidden bg-[#f6f8f6] dark:bg-[#102216] font-['Inter',_sans-serif]">
        {/* Header */}
        <ProductPageHeader />

        {/* Nội dung */}
        <main className="p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-8 animate-in fade-in duration-500">
          {/* Thanh lọc & tìm kiếm */}
          <FilterBar
            searchKeyword={searchKeyword}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            minPrice={minPrice}
            maxPrice={maxPrice}
            categories={categories}
            priceRanges={priceRanges}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
            onPriceRangeChange={handlePriceRangeChange}
            onApplyFilter={handleApplyFilter}
            onClearFilter={handleClearFilter}
          />

          {/* Bảng sản phẩm */}
          <ProductTable
            products={products}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onDelete={handleOpenDeleteDialog}
          />

          {/* Thẻ thống kê */}
          <ProductStats />
        </main>
      </div>
    </>
  );
}

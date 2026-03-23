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
import {
  useProducts,
  useDeleteProduct,
} from "@/features/admin/products/hooks/useProducts";
import { useCategories } from "@/features/admin/products/hooks/useCategories";
import { Product } from "@/features/admin/products/types";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ─── Pending filters (chưa áp dụng) ────────────────────────────────────────
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );
  const [sortBy, setSortBy] = useState("newest");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // ─── Applied filters (đã áp dụng, dùng để fetch) ────────────────────────────
  const [appliedSearchKeyword, setAppliedSearchKeyword] = useState("");
  const [appliedCategory, setAppliedCategory] = useState<string | undefined>(
    undefined,
  );
  const [appliedSortBy, setAppliedSortBy] = useState("newest");
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);

  // ─── Pagination & UI ─────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProductForDelete, setSelectedProductForDelete] =
    useState<Product | null>(null);

  // ─── Data fetching ───────────────────────────────────────────────────────────
  const {
    products,
    loading: productsLoading,
    fetching,
    totalPages = 1,
  } = useProducts({
    search: appliedSearchKeyword,
    category: appliedCategory === "Tất cả" ? undefined : appliedCategory,
    sort: appliedSortBy === "newest" ? undefined : appliedSortBy,
    priceMin: appliedMinPrice,
    priceMax: appliedMaxPrice,
    page: currentPage,
  });

  const { categories, loading: categoriesLoading } = useCategories({
    limit: 6,
  });

  // ─── Mutations ────────────────────────────────────────────────────────────────
  const { deleteProduct, isPending: isDeleting } = useDeleteProduct();

  // ─── Init từ URL ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const keyword = searchParams.get("search") || "";
    const category = searchParams.get("category") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const sort = searchParams.get("sort") || "newest";
    const minPriceVal = searchParams.get("minPrice")
      ? parseInt(searchParams.get("minPrice")!)
      : null;
    const maxPriceVal = searchParams.get("maxPrice")
      ? parseInt(searchParams.get("maxPrice")!)
      : null;

    setSearchKeyword(keyword);
    setSelectedCategory(category);
    setCurrentPage(page);
    setSortBy(sort);
    setMinPrice(minPriceVal);
    setMaxPrice(maxPriceVal);

    setAppliedSearchKeyword(keyword);
    setAppliedCategory(category);
    setAppliedSortBy(sort);
    setAppliedMinPrice(minPriceVal);
    setAppliedMaxPrice(maxPriceVal);
  }, [searchParams]);

  // ─── URL helper ───────────────────────────────────────────────────────────────
  const updateQueryParams = (
    keyword?: string,
    category?: string,
    page?: number,
    sort?: string,
    minPriceParam?: number | null,
    maxPriceParam?: number | null,
  ) => {
    const params = new URLSearchParams();

    const kw = keyword !== undefined ? keyword : searchKeyword;
    if (kw) params.set("search", kw);

    const cat = category !== undefined ? category : selectedCategory;
    if (cat) params.set("category", cat);

    const pageNum = page !== undefined ? page : currentPage;
    if (pageNum > 1) params.set("page", pageNum.toString());

    const sortVal = sort !== undefined ? sort : sortBy;
    if (sortVal !== "newest") params.set("sort", sortVal);

    const minVal = minPriceParam !== undefined ? minPriceParam : minPrice;
    const maxVal = maxPriceParam !== undefined ? maxPriceParam : maxPrice;
    if (minVal !== null) params.set("minPrice", minVal.toString());
    if (maxVal !== null) params.set("maxPrice", maxVal.toString());

    const qs = params.toString();
    router.push(qs ? `?${qs}` : "/admin/products");
  };

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value || undefined);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value;
    setSortBy(sort);
    setAppliedSortBy(sort);
    setCurrentPage(1);
    updateQueryParams(
      appliedSearchKeyword,
      appliedCategory,
      1,
      sort,
      appliedMinPrice,
      appliedMaxPrice,
    );
  };

  const handlePriceRangeChange = (
    minVal: number | null,
    maxVal: number | null,
  ) => {
    setMinPrice(minVal);
    setMaxPrice(maxVal);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateQueryParams(
      appliedSearchKeyword,
      appliedCategory,
      newPage,
      appliedSortBy,
      appliedMinPrice,
      appliedMaxPrice,
    );
  };

  const handleApplyFilter = () => {
    setAppliedSearchKeyword(searchKeyword);
    setAppliedCategory(selectedCategory);
    setAppliedSortBy(sortBy);
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
    setCurrentPage(1);
    updateQueryParams(
      searchKeyword,
      selectedCategory,
      1,
      sortBy,
      minPrice,
      maxPrice,
    );
  };

  const handleClearFilter = () => {
    setSearchKeyword("");
    setSelectedCategory(undefined);
    setSortBy("newest");
    setMinPrice(null);
    setMaxPrice(null);
    setAppliedSearchKeyword("");
    setAppliedCategory(undefined);
    setAppliedSortBy("newest");
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);
    setCurrentPage(1);
    router.push("/admin/products");
  };

  // ─── Delete handlers ──────────────────────────────────────────────────────────
  const handleOpenDeleteDialog = (product: Product) => {
    setSelectedProductForDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProductForDelete(null);
  };

  // ✅ Dùng useDeleteProduct thay vì simulate API
  const handleConfirmDelete = () => {
    if (!selectedProductForDelete) return;
    deleteProduct(selectedProductForDelete.id, {
      onSuccess: () => handleCloseDeleteDialog(),
    });
  };

  // ─── Derived state ────────────────────────────────────────────────────────────
  const hasActiveFilters =
    appliedSearchKeyword !== "" ||
    appliedCategory !== undefined ||
    appliedSortBy !== "newest" ||
    appliedMinPrice !== null ||
    appliedMaxPrice !== null;

  const priceRanges = [
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

  // ✅ Chỉ block toàn trang lần đầu, sau đó dùng fetching overlay trên table
  if (productsLoading || categoriesLoading) return <Loading />;

  return (
    <>
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
        <ProductPageHeader />

        <main className="p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-8 animate-in fade-in duration-500">
          <FilterBar
            searchKeyword={searchKeyword}
            selectedCategory={selectedCategory || "Tất cả"}
            sortBy={sortBy}
            minPrice={minPrice}
            maxPrice={maxPrice}
            categories={categories}
            priceRanges={priceRanges}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
            onPriceRangeChange={handlePriceRangeChange}
            onApplyFilter={handleApplyFilter}
            onClearFilter={handleClearFilter}
          />

          <ProductTable
            products={products}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onDelete={handleOpenDeleteDialog}
            isLoading={fetching} // ✅ fetching từ React Query, không phải local state
          />

          <ProductStats />
        </main>
      </div>
    </>
  );
}

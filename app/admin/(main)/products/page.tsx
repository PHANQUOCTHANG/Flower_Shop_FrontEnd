"use client";

import React, { Suspense } from "react";
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
import { useProductsPageLogic } from "@/features/admin/products/hooks/useProductsPageLogic";

// Types & constants
import {
  FILTER_DEFAULTS,
  PRODUCT_PRICE_RANGES,
} from "@/features/admin/products/constants/productConfig";

function ProductsPageContent() {
  const { state, actions } = useProductsPageLogic();

  if (state.productsLoading || state.categoriesLoading) return <Loading />;

  return (
    <>
      {/* Delete confirm dialog */}
      <DeleteConfirmDialog
        isOpen={state.isDeleteDialogOpen}
        title="Xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm"
        itemName={state.selectedProductForDelete?.name || ""}
        onConfirm={actions.handleConfirmDelete}
        onCancel={actions.handleCloseDeleteDialog}
        isLoading={state.isDeleting}
      />

      <div className="flex flex-col min-h-screen overflow-auto bg-[#f6f8f6] font-['Inter',_sans-serif]">
        {/* Header */}
        <ProductPageHeader />

        {/* Main content */}
        <main className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-6 sm:gap-8 animate-in fade-in duration-500">
          {/* Filters */}
          <FilterBar
            searchKeyword={state.searchKeyword}
            selectedCategory={
              state.selectedCategory || FILTER_DEFAULTS.CATEGORY_ALL
            }
            selectedStatus={state.statusFilter}
            sortBy={state.sortBy}
            minPrice={state.minPrice}
            maxPrice={state.maxPrice}
            categories={state.categories}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            priceRanges={PRODUCT_PRICE_RANGES as any}
            hasActiveFilters={state.isFiltersActive}
            onSearchChange={actions.handleSearchChange}
            onCategoryChange={actions.handleCategoryChange}
            onStatusChange={actions.handleStatusChange}
            onSortChange={actions.handleSortChange}
            onPriceRangeChange={actions.handlePriceRangeChange}
            onApplyFilter={actions.handleApplyFilter}
            onClearFilter={actions.handleClearFilter}
          />

          {/* Product table */}
          <ProductTable
            products={state.products}
            totalPages={state.totalPages}
            currentPage={state.currentPage}
            onPageChange={actions.handlePageChange}
            onDelete={actions.handleOpenDeleteDialog}
            isLoading={state.fetching}
          />

          {/* Stats */}
          <ProductStats data={state.meta} />
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

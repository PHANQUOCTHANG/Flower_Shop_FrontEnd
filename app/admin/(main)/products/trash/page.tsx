"use client";

import React, { Suspense } from "react";
import { Loading } from "@/components/ui/Loading";
import { DeleteConfirmDialog } from "@/components/ui/admin/DeleteConfirmDialog";

// Components
import {
  FilterBar,
  TrashProductTable,
  ProductPageHeader,
} from "@/features/admin/products/components";

// Hooks
import { useTrashProductsPageLogic } from "@/features/admin/products/hooks/useTrashProductsPageLogic";

// Types & constants
import { PRODUCT_PRICE_RANGES } from "@/features/admin/products/constants/productConfig";

function TrashProductsPageContent() {
  const { state, actions } = useTrashProductsPageLogic();

  if (state.productsLoading || state.categoriesLoading) return <Loading />;

  return (
    <>
      {/* Xóa vĩnh viễn confirm dialog */}
      <DeleteConfirmDialog
        isOpen={state.isDeleteDialogOpen}
        title="Xóa vĩnh viễn sản phẩm"
        message="Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm"
        itemName={state.selectedProductForDelete?.name || ""}
        onConfirm={actions.handleConfirmDelete}
        onCancel={actions.handleCloseDeleteDialog}
        isLoading={state.isDeleting}
      />

      <div className="flex flex-col min-h-screen overflow-auto bg-[#f6f8f6] font-['Inter',_sans-serif]">
        {/* Header */}
        <ProductPageHeader variant="trash" />

        {/* Main content */}
        <main className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-6 sm:gap-8 animate-in fade-in duration-500">
          {/* Filters — dùng lại toàn bộ bộ lọc của trang quản lý sản phẩm */}
          <FilterBar
            searchKeyword={state.searchKeyword}
            selectedCategory={state.selectedCategory || "Tất cả"}
            sortBy={state.sortBy}
            minPrice={state.minPrice}
            maxPrice={state.maxPrice}
            categories={state.categories}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            priceRanges={PRODUCT_PRICE_RANGES as any}
            hasActiveFilters={state.isFiltersActive}
            showStatusFilter={false}
            onSearchChange={actions.handleSearchChange}
            onCategoryChange={actions.handleCategoryChange}
            onSortChange={actions.handleSortChange}
            onPriceRangeChange={actions.handlePriceRangeChange}
            onApplyFilter={actions.handleApplyFilter}
            onClearFilter={actions.handleClearFilter}
          />

          {/* Trash table */}
          <TrashProductTable
            products={state.products}
            totalPages={state.totalPages}
            currentPage={state.currentPage}
            onPageChange={actions.handlePageChange}
            onRestore={actions.handleRestore}
            onHardDelete={actions.handleOpenDeleteDialog}
            isLoading={state.fetching}
            isRestoring={state.isRestoring}
          />

          {/* Tổng quan */}
          <p className="text-xs text-slate-400 font-medium text-center">
            {state.meta?.total ?? 0} sản phẩm trong thùng rác
          </p>
        </main>
      </div>
    </>
  );
}

export default function TrashProductsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TrashProductsPageContent />
    </Suspense>
  );
}

"use client";

import { Suspense } from "react";
import {
  FilterSidebar,
  ProductToolbar,
  ProductGrid,
} from "@/features/products/components";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Loading } from "@/components/ui/Loading";
import { Pagination } from "@/components/ui/Pagination";
import { useProductCollectionLogic } from "@/features/products/hooks/useProductCollectionLogic";

function FlowerCollectionContent() {
  const { state, actions } = useProductCollectionLogic();

  // --- Trạng thái tải dữ liệu ban đầu ---
  if (state.productsLoading || state.categoriesLoading) return <Loading />;

  // --- Render giao diện ---
  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1b0d11] transition-colors duration-300 font-sans antialiased">
      <main className="max-w-360 mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 lg:py-10">
        {/* Điều hướng (Breadcrumb) */}
        <div className="mb-4 sm:mb-6">
          <Breadcrumbs
            items={[{ label: "Trang chủ", href: "/" }, { label: "Sản phẩm" }]}
          />
        </div>

        {/* Tiêu đề trang (Page Header) */}
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
          {/* Sidebar lọc sản phẩm */}
          <FilterSidebar
            minPrice={state.minPrice}
            maxPrice={state.maxPrice}
            selectedCategory={state.selectedCategory}
            categories={state.categories}
            onPriceChange={actions.handlePriceChange}
            onCategoryChange={actions.handleCategoryChange}
            isOpen={state.isMobileFilterOpen}
            onClose={() => actions.setIsMobileFilterOpen(false)}
          />

          {/* Nội dung chính: Danh sách sản phẩm */}
          <div className="flex-1">
            {/* Thanh công cụ: Tìm kiếm, Sắp xếp, Chế độ xem */}
            <ProductToolbar
              viewMode={state.viewMode}
              searchInput={state.searchInput}
              sort={state.sort}
              hasActiveFilters={state.hasActiveFilters}
              onViewModeChange={actions.setViewMode}
              onSearchChange={actions.handleSearchChange}
              onSortChange={actions.handleSort}
              onClearFilters={actions.handleClearFilters}
              onOpenFilter={() => actions.setIsMobileFilterOpen(true)}
            />

            {/* Lưới sản phẩm */}
            <ProductGrid
              products={state.products}
              viewMode={state.viewMode}
              fetching={state.fetching}
            />

            {/* Phân trang */}
            <Pagination
              currentPage={state.currentPage}
              totalPages={state.totalPages}
              onPageChange={actions.handlePageChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function FlowerCollectionClient() {
  return (
    <Suspense fallback={<Loading />}>
      <FlowerCollectionContent />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  Filter,
  CheckCircle,
  LayoutGrid,
  List,
} from "lucide-react";
import { useProducts } from "@/features/products/hooks/useProducts";
import { Breadcrumbs } from "@/features/products/components/Breadcrumbs";
import { FilterSection } from "@/features/products/components/FilterSection";
import { ProductCard } from "@/features/products/components/ProductCard";
import { usePagination } from "@/features/products/hooks/usePagination";

export default function FlowerCollection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy params từ URL
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const selectedOccasion = searchParams.get("occasion") || "Kỷ niệm";
  const sortBy = searchParams.get("sort") || "Bán chạy nhất";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // hooks
  const { PRODUCTS } = useProducts();
  const { paginatedProducts, getPageNumbers, totalPages } = usePagination(
    PRODUCTS,
    currentPage,
  );

  // Helper function để tạo URL params
  const createQueryString = (params: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      newParams.set(key, String(value));
    });
    return `?${newParams.toString()}`;
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push(`/products${createQueryString({ page })}`);
  };

  // Handle filter
  const handleOccasionChange = (occasion: string) => {
    router.push(`/products${createQueryString({ occasion, page: 1 })}`);
  };

  // Handle sort
  const handleSort = (sort: string) => {
    router.push(`/products${createQueryString({ sort })}`);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] dark:bg-[#1a0f12] text-[#1b0d11] dark:text-white transition-colors duration-300 font-sans antialiased">
      <div className="max-w-360 mx-auto px-4 sm:px-10 lg:px-20 py-10">
        <Breadcrumbs />

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Bộ lọc */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-28 space-y-2">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Filter size={20} className="text-[#13ec5b]" />
                  <h3 className="typo-heading-md text-[#0d1b12] dark:text-white">
                    Bộ lọc
                  </h3>
                </div>
                <p className="typo-caption-xs text-[#4c9a66]">
                  Tinh chỉnh lựa chọn
                </p>
              </div>

              <FilterSection title="Khoảng giá">
                {[
                  "Dưới 500.000đ",
                  "500.000đ - 1.000.000đ",
                  "1.000.000đ - 2.000.000đ",
                  "Trên 2.000.000đ",
                ].map((range) => (
                  <label
                    key={range}
                    className="flex items-center gap-3 cursor-pointer group/item"
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="peer appearance-none size-5 border-2 border-[#ccc] dark:border-white/20 rounded-md checked:bg-[#13ec5b] checked:border-[#13ec5b] transition-all"
                      />
                      <CheckCircle
                        size={12}
                        className="absolute left-1 text-[#0d1b12] opacity-0 peer-checked:opacity-100 transition-opacity"
                      />
                    </div>
                    <span className="typo-body-sm text-[#4c9a66] dark:text-white/60 group-hover/item:text-[#13ec5b] transition-colors">
                      {range}
                    </span>
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="Dịp lễ">
                {[
                  { name: "Sinh nhật", count: 12 },
                  { name: "Kỷ niệm", count: null },
                  { name: "Tình yêu", count: 24 },
                  { name: "Nhà mới", count: 8 },
                ].map((occ) => (
                  <button
                    key={occ.name}
                    onClick={() => handleOccasionChange(occ.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all typo-button-sm ${
                      selectedOccasion === occ.name
                        ? "bg-[#13ec5b] text-[#0d1b12]"
                        : "hover:bg-[#e7f3eb] dark:hover:bg-white/5 text-[#4c9a66] dark:text-white/60"
                    }`}
                  >
                    <span>{occ.name}</span>
                    {occ.count ? (
                      <span
                        className={`typo-caption-xs px-2 py-0.5 rounded-full ${selectedOccasion === occ.name ? "bg-black/10" : "bg-[#13ec5b]/20 text-[#13ec5b]"}`}
                      >
                        {occ.count}
                      </span>
                    ) : (
                      <CheckCircle size={16} />
                    )}
                  </button>
                ))}
              </FilterSection>
            </div>
          </aside>

          {/* Nội dung chính */}
          <div className="flex-1">
            {/* Header Danh mục */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-1 bg-[#e7f3eb] dark:bg-white/5 p-1 rounded-xl">
                  {/* Chế độ xem lưới */}
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-white dark:bg-white/10 shadow-sm text-[#13ec5b]"
                        : "text-[#4c9a66] dark:text-white/40 hover:text-[#0d1b12] dark:hover:text-white"
                    }`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  {/* Chế độ xem danh sách */}
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "list"
                        ? "bg-white dark:bg-white/10 shadow-sm text-[#13ec5b]"
                        : "text-[#4c9a66] dark:text-white/40 hover:text-[#0d1b12] dark:hover:text-white"
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>
                <div className="flex-1 md:flex-none relative bg-white dark:bg-white/5 p-2 px-4 rounded-xl border border-[#e7f3eb] dark:border-white/10 flex items-center gap-3 min-w-50">
                  <span className="typo-caption-xs text-[#4c9a66] whitespace-nowrap">
                    Sắp xếp:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value)}
                    className="bg-transparent border-none typo-body-sm font-bold text-[#0d1b12] dark:text-white focus:ring-0 p-0 cursor-pointer w-full outline-none"
                  >
                    <option>Bán chạy nhất</option>
                    <option>Giá: Thấp đến Cao</option>
                    <option>Giá: Cao đến Thấp</option>
                    <option>Mới nhất</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lưới sản phẩm */}
            {paginatedProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10"
                    : "space-y-4"
                }
              >
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="typo-body text-[#4c9a66] dark:text-white/60">
                  Không tìm thấy sản phẩm nào
                </p>
              </div>
            )}

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="size-12 rounded-full border-2 border-[#e7f3eb] dark:border-white/10 flex items-center justify-center text-[#4c9a66] dark:text-white/40 hover:border-[#13ec5b] hover:text-[#13ec5b] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-2">
                  {getPageNumbers().map((page, idx) => (
                    <button
                      key={`${page}-${idx}`}
                      onClick={() => {
                        if (typeof page === "number") {
                          handlePageChange(page);
                        }
                      }}
                      disabled={page === "..."}
                      className={`size-12 rounded-full typo-button-sm transition-all ${
                        page === currentPage
                          ? "bg-[#13ec5b] text-[#0d1b12] shadow-lg shadow-[#13ec5b]/30"
                          : page === "..."
                            ? "text-[#ccc] dark:text-white/20 cursor-default"
                            : "text-[#0d1b12] dark:text-white hover:bg-[#e7f3eb] dark:hover:bg-white/5 cursor-pointer"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="size-12 rounded-full border-2 border-[#e7f3eb] dark:border-white/10 flex items-center justify-center text-[#4c9a66] dark:text-white/40 hover:border-[#13ec5b] hover:text-[#13ec5b] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

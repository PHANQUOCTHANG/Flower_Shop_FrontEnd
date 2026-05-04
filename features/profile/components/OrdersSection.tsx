// Component section đơn hàng với bộ lọc, bảng và phân trang

"use client";

import React, { FC, useState } from "react";
import { Package, RefreshCw } from "lucide-react";
import { OrdersFilters } from "@/features/profile/components/OrdersFilters";
import { OrdersTable } from "@/features/profile/components/OrdersTable";
import Alert from "@/components/ui/Alert";
import { Pagination } from "@/components/ui/Pagination";
import { MyOrder } from "@/features/profile/types/profile";

// Props của component
interface OrdersSectionProps {
  // Danh sách đơn hàng
  orders: MyOrder[];
  // Metadata phân trang
  meta?: { totalPages: number; page: number };
  // Trạng thái loading
  isLoading?: boolean;
  // Thông báo lỗi
  error?: string | null;
  // Trang hiện tại
  currentPage: number;
  // Callback khi đổi trang
  onPageChange: (page: number) => void;
  // Trạng thái bộ lọc
  status: string;
  // Callback khi thay đổi trạng thái
  onStatusChange: (status: string) => void;
  // Loại sắp xếp
  sort: string;
  // Callback khi thay đổi sắp xếp
  onSortChange: (sort: string) => void;
  // Callback khi click làm mới
  onRefresh: () => Promise<void>;
  // Trạng thái loading của refresh
  isRefreshing?: boolean;
  // Callback khi click xem chi tiết
  onViewOrder: (orderId: string) => void;
}

// Component chính
export const OrdersSection: FC<OrdersSectionProps> = ({
  orders,
  meta,
  isLoading = false,
  error = null,
  currentPage,
  onPageChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  onRefresh,
  isRefreshing = false,
  onViewOrder,
}) => {
  // Xử lý khi click làm mới
  const handleRefresh = async () => {
    await onRefresh();
  };

  return (
    <section className="animate-in fade-in duration-500 relative w-full">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#EE2B5B]/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-10 -mt-10 z-0" />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-10 relative z-10">
        {/* Títl và nút làm mới */}
        <div className="flex items-center justify-between gap-3 xs:gap-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight leading-tight">
            Đơn hàng của bạn
          </h2>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#EE2B5B]/10 hover:text-[#D11E48] transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-sm hover:shadow-md border border-slate-100"
            type="button"
          >
            <RefreshCw
              size={12}
              className={isRefreshing ? "animate-spin" : ""}
            />
            <span>{isRefreshing ? "Tải..." : "Làm mới"}</span>
          </button>
        </div>

        {/* Bộ lọc và sắp xếp */}
        <OrdersFilters
          status={status}
          onStatusChange={(newStatus) => {
            onStatusChange(newStatus);
            onPageChange(1); // Reset về trang 1 khi thay đổi bộ lọc
          }}
          sort={sort}
          onSortChange={(newSort) => {
            onSortChange(newSort);
            onPageChange(1); // Reset về trang 1 khi thay đổi sắp xếp
          }}
        />
      </div>

      {/* Trạng thái đang tải */}
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin">
            <Package className="text-[#EE2B5B]" size={32} />
          </div>
        </div>
      )}

      {/* Trạng thái lỗi */}
      {error && (
        <Alert
          type="error"
          message="Không thể tải danh sách đơn hàng. Vui lòng thử lại."
          onClose={() => {}}
        />
      )}

      {/* Trạng thái rỗng */}
      {!isLoading && !error && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 animate-in fade-in zoom-in-95 duration-500 relative z-10">
          <div className="size-24 rounded-full bg-[#EE2B5B]/10 flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-[#EE2B5B]/20 animate-ping opacity-20" />
            <Package className="text-[#0d9e3e] relative z-10" size={40} />
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-2">Chưa có đơn hàng nào</h3>
          <p className="text-sm text-slate-500 max-w-xs text-center mb-6">
            Bạn chưa thực hiện đơn hàng nào. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi nhé!
          </p>
          <a
            href="/products"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#EE2B5B] to-[#D11E48] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-lg hover:shadow-[#EE2B5B]/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            Khám phá ngay
          </a>
        </div>
      )}

      {/* Bảng đơn hàng */}
      {!isLoading && !error && orders.length > 0 && (
        <>
          <OrdersTable orders={orders} onViewOrder={onViewOrder} />

          {/* Phân trang */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={meta.totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
};

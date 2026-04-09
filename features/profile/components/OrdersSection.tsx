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
    <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm animate-in slide-in-from-right-10 duration-500">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-10">
        {/* Títl và nút làm mới */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">
            Đơn hàng của bạn
          </h2>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#ee2b5b]/10 text-[#ee2b5b] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#ee2b5b] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            <RefreshCw
              size={14}
              className={isRefreshing ? "animate-spin" : ""}
            />
            <span className="hidden sm:inline">
              {isRefreshing ? "Đang tải..." : "Làm mới"}
            </span>
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
            <Package className="text-[#ee2b5b]" size={32} />
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
        <div className="text-center py-10">
          <p className="text-slate-500">Bạn chưa có đơn hàng nào</p>
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

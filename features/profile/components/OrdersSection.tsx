// Component section đơn hàng với bộ lọc, bảng và phân trang

"use client";

import React, { FC } from "react";
import Link from "next/link";
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
      <div className="flex flex-col mb-8 relative z-10">
        {/* Títl và nút làm mới */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              Đơn hàng của bạn
            </h2>
            <p className="text-sm text-slate-500">
              Xem lại toàn bộ lịch sử mua sắm và trạng thái đơn hàng của bạn.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#EE2B5B] hover:text-white transition-all disabled:opacity-50 shadow-sm border border-slate-100"
            type="button"
          >
            <RefreshCw
              size={14}
              className={isRefreshing ? "animate-spin" : ""}
            />
            <span>{isRefreshing ? "Đang tải" : "Làm mới"}</span>
          </button>
        </div>

        {/* Bộ lọc và sắp xếp */}
        <OrdersFilters
          status={status}
          onStatusChange={(newStatus) => {
            onStatusChange(newStatus);
            onPageChange(1);
          }}
          sort={sort}
          onSortChange={(newSort) => {
            onSortChange(newSort);
            onPageChange(1);
          }}
        />
      </div>

      {/* Trạng thái đang tải */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="animate-spin mb-4">
            <RefreshCw className="text-[#EE2B5B]" size={32} />
          </div>
          <p className="text-slate-500 font-medium">
            Đang tải danh sách đơn hàng...
          </p>
        </div>
      )}

      {/* Trạng thái lỗi */}
      {error && !isLoading && (
        <div className="mb-6">
          <Alert
            type="error"
            message="Không thể tải danh sách đơn hàng. Vui lòng thử lại."
            onClose={() => {}}
          />
        </div>
      )}

      {/* Trạng thái rỗng */}
      {!isLoading && !error && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm animate-in fade-in zoom-in-95 duration-500 relative z-10">
          <div className="size-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
            <Package className="text-slate-300" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Chưa có đơn hàng nào
          </h3>
          <p className="text-sm text-slate-500 max-w-xs text-center mb-8">
            Bạn chưa thực hiện đơn hàng nào. Hãy khám phá các sản phẩm tuyệt vời
            của chúng tôi nhé!
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-[#EE2B5B] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#D11E48] hover:shadow-lg hover:shadow-[#EE2B5B]/20 transition-all duration-300"
          >
            Khám phá ngay
          </Link>
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

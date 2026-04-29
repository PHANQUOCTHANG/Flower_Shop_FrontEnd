import React from "react";
import { Eye, ChevronRight } from "lucide-react";
import { OrderResponse } from "@/types/order";
import { StatusBadge } from "./StatusBadge";
import { Pagination } from "@/components/ui/admin/Pagination";
import { formatCurrency, formatDate } from "@/utils/format";

interface OrdersTableProps {
  orders: OrderResponse[];
  loading: boolean;
  totalOrders: number;
  totalPages: number;
  currentPage: number;
  onStatusUpdate: (orderId: string, status: string) => void;
  onViewDetails: (orderId: string) => void;
  onPageChange: (page: number) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  loading,
  totalOrders,
  totalPages,
  currentPage,
  onStatusUpdate,
  onViewDetails,
  onPageChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative flex flex-col">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-2xl">
          <div className="flex items-center justify-center">
            <div className="size-10 border-[3px] border-slate-200 border-t-[#13ec5b] rounded-full animate-spin" />
          </div>
        </div>
      )}

      {/* ── Desktop Table (md+) ─────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                Mã đơn
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                Ngày đặt
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                Khách hàng
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap hidden lg:table-cell">
                Số điện thoại
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">
                Tổng tiền
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap hidden lg:table-cell">
                Thanh toán
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">
                Trạng thái
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-14 text-center text-slate-400 text-sm font-medium"
                >
                  Không có đơn hàng nào
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-5 py-4 text-sm font-black text-[#13ec5b] font-mono">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500 font-medium whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-slate-900 max-w-[160px] truncate">
                    {order.user?.fullName}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500 font-medium hidden lg:table-cell">
                    {order.shippingPhone}
                  </td>
                  <td className="px-5 py-4 text-sm font-black text-slate-900 text-right whitespace-nowrap">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td className="px-5 py-4 text-center hidden lg:table-cell">
                    <StatusBadge
                      label={order.paymentMethod || "cod"}
                      type="method"
                    />
                  </td>
                  <td className="px-5 py-4 text-center">
                    <StatusBadge label={order.status} type="status" />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {order.status === "pending" && (
                        <button
                          onClick={() => onStatusUpdate(order.id, "processing")}
                          className="bg-[#13ec5b] text-[#102216] text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
                        >
                          Giao hàng
                        </button>
                      )}
                      {order.status === "processing" && (
                        <button
                          onClick={() => onStatusUpdate(order.id, "completed")}
                          className="bg-blue-500 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
                        >
                          Hoàn tất
                        </button>
                      )}
                      <button
                        onClick={() => onViewDetails(order.id)}
                        className="p-2 text-slate-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/10 rounded-xl transition-all"
                        title="Xem chi tiết"
                      >
                        <Eye size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Card List (< md) ─────────────────────── */}
      <div className="md:hidden divide-y divide-slate-100">
        {orders.length === 0 ? (
          <div className="py-14 text-center text-slate-400 text-sm font-medium">
            Không có đơn hàng nào
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              onClick={() => onViewDetails(order.id)}
              className="w-full text-left px-4 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors flex items-start gap-3 cursor-pointer"
            >
              {/* Left: info */}
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                {/* Row 1: Mã đơn + trạng thái */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-[#13ec5b] font-mono">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </span>
                  <StatusBadge label={order.status} type="status" />
                </div>
                {/* Row 2: Tên khách */}
                <p className="text-sm font-bold text-slate-900 truncate">
                  {order.user?.fullName}
                </p>
                {/* Row 3: Ngày + SĐT */}
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <span>{formatDate(order.createdAt)}</span>
                  {order.shippingPhone && (
                    <>
                      <span className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                      <span>{order.shippingPhone}</span>
                    </>
                  )}
                </div>
                {/* Row 4: Phương thức + tổng tiền */}
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge
                    label={order.paymentMethod || "cod"}
                    type="method"
                  />
                  <span className="text-sm font-black text-slate-900">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>

                {/* Action buttons for pending/processing on mobile */}
                {(order.status === "pending" ||
                  order.status === "processing") && (
                  <div
                    className="flex gap-2 mt-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {order.status === "pending" && (
                      <button
                        onClick={() => onStatusUpdate(order.id, "processing")}
                        className="bg-[#13ec5b] text-[#102216] text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all"
                      >
                        Giao hàng
                      </button>
                    )}
                    {order.status === "processing" && (
                      <button
                        onClick={() => onStatusUpdate(order.id, "completed")}
                        className="bg-blue-500 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all"
                      >
                        Hoàn tất
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Right: arrow */}
              <ChevronRight
                size={18}
                className="text-slate-300 shrink-0 mt-1"
              />
            </div>
          ))
        )}
      </div>

      {/* Phân trang */}
      <Pagination
        products={orders}
        totalPages={totalPages}
        currentPage={currentPage}
        totalItems={totalOrders}
        onPageChange={onPageChange}
      />
    </div>
  );
};

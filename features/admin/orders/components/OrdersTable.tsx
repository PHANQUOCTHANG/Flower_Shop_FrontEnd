import React from "react";
import { Eye } from "lucide-react";
import { OrderResponse } from "@/types/order";
import { StatusBadge } from "./StatusBadge";
import { Pagination } from "@/components/ui/admin/Pagination";
import { formatDate } from "@/utils/format";

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
      <div className="overflow-x-auto">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl">
            <div className="relative">
              {/* Spinner xoay */}
              <div className="relative flex items-center justify-center">
                <div className="size-12 border-3 border-slate-300 border-t-[#13ec5b] rounded-full animate-spin"></div>
                <span className="absolute text-xs font-bold text-slate-500 "></span>
              </div>
            </div>
          </div>
        )}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 ">
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                Mã đơn
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                Ngày đặt
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                Tên khách hàng
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                Số điện thoại giao
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                Tổng tiền
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                Thanh toán
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 ">
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  Không có đơn hàng
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-6 py-5 text-sm font-black text-[#13ec5b]">
                    {order.id}
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-900 ">
                    {order.user?.fullName}
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                    {order.shippingPhone}
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-slate-900 text-right">
                    ₫{Math.floor(order.totalPrice).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <StatusBadge label={order.paymentStatus} type="payment" />
                  </td>
                  <td className="px-6 py-5 text-center">
                    <StatusBadge label={order.status} type="status" />
                  </td>
                  <td className="px-6 py-5 text-right">
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
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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

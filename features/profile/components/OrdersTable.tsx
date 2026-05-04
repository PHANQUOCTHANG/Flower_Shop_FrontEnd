// Component hiển thị bảng danh sách đơn hàng

"use client";

import React, { FC } from "react";
import { Eye } from "lucide-react";
import {
  ORDER_STATUS_MAP,
  StatusConfig,
} from "@/features/profile/constants/profile.constants";
import { MyOrder } from "@/features/profile/types/profile";

// Props của component
interface OrdersTableProps {
  // Danh sách đơn hàng
  orders: MyOrder[];
  // Callback khi click nút xem chi tiết
  onViewOrder: (orderId: string) => void;
}

// Component hiện thị badge trạng thái
interface StatusBadgeProps {
  // Trạng thái đơn hàng
  status: string;
}

const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  // Chuyển đổi sang chữ thường để kiểm tra trong map
  const statusLower = status?.toLowerCase() || "";
  const { styles, label }: StatusConfig = ORDER_STATUS_MAP[statusLower] || {
    styles: "bg-gray-100 text-gray-700",
    label: status,
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles}`}
    >
      {label}
    </span>
  );
};

// Component hiển thị một dòng đơn hàng
interface OrderRowProps {
  order: MyOrder;
  onViewOrder: (orderId: string) => void;
}

const OrderRow: FC<OrderRowProps> = ({ order, onViewOrder }) => {
  return (
    <tr 
      className="group hover:bg-[#13ec5b]/5 transition-colors duration-300 cursor-pointer" 
      onClick={() => onViewOrder(order.id)}
    >
      {/* Mã đơn hàng */}
      <td className="py-4 sm:py-5 px-4 sm:px-6 text-xs sm:text-sm font-black text-[#0d1b12] truncate max-w-[120px]">
        {order.id}
      </td>

      {/* Ngày đặt - ẩn trên mobile, hiện từ sm trở lên */}
      <td className="py-4 sm:py-5 px-4 sm:px-6 text-xs sm:text-sm font-bold text-slate-500 hidden sm:table-cell">
        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
      </td>

      {/* Trạng thái */}
      <td className="py-4 sm:py-5 px-4 sm:px-6">
        <StatusBadge status={order.status} />
      </td>

      {/* Thành tiền */}
      <td className="py-4 sm:py-5 px-4 sm:px-6 text-right text-xs sm:text-sm font-black text-slate-900">
        {order.totalPrice.toLocaleString("vi-VN")}₫
      </td>

      {/* Hành động */}
      <td className="py-4 sm:py-5 px-4 sm:px-6 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewOrder(order.id);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-600 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest group-hover:border-[#13ec5b] group-hover:bg-[#13ec5b] group-hover:text-[#0d1b12] shadow-sm transition-all duration-300"
          type="button"
        >
          <Eye size={12} />
          <span className="hidden sm:inline">Xem</span>
        </button>
      </td>
    </tr>
  );
};

// Component chính
export const OrdersTable: FC<OrdersTableProps> = ({ orders, onViewOrder }) => {
  return (
    <div className="overflow-x-auto no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0 relative z-10">
      <div className="min-w-[600px] sm:min-w-full rounded-2xl ring-1 ring-slate-100 overflow-hidden bg-white">
        <table className="w-full">
          {/* Header của bảng */}
          <thead className="bg-slate-50/80">
            <tr className="text-left">
              <th className="py-4 px-4 sm:px-6 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Mã đơn
              </th>
              <th className="py-4 px-4 sm:px-6 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest hidden sm:table-cell">
                Ngày đặt
              </th>
              <th className="py-4 px-4 sm:px-6 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Trạng thái
              </th>
              <th className="py-4 px-4 sm:px-6 text-right text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Thành tiền
              </th>
              <th className="py-4 px-4 sm:px-6 text-center text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <span className="hidden sm:inline">Hành động</span>
                <span className="sm:hidden">Xem</span>
              </th>
            </tr>
          </thead>

        {/* Nội dung bảng */}
          <tbody className="divide-y divide-slate-50/80 text-xs sm:text-sm">
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} onViewOrder={onViewOrder} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

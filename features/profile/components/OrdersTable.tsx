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
    <tr className="group hover:bg-slate-50/50 transition-colors">
      {/* Mã đơn hàng */}
      <td className="py-4 sm:py-6 text-xs sm:text-sm font-black text-[#ee2b5b] truncate max-w-[100px]">
        {order.id}
      </td>

      {/* Ngày đặt - ẩn trên mobile, hiện từ sm trở lên */}
      <td className="py-4 sm:py-6 text-xs sm:text-sm font-bold text-slate-500 hidden sm:table-cell">
        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
      </td>

      {/* Trạng thái */}
      <td className="py-4 sm:py-6">
        <StatusBadge status={order.status} />
      </td>

      {/* Thành tiền */}
      <td className="py-4 sm:py-6 text-right text-xs sm:text-sm font-black text-slate-900">
        {order.totalPrice.toLocaleString("vi-VN")}₫
      </td>

      {/* Hành động */}
      <td className="py-4 sm:py-6 pl-3 sm:pl-6 text-center">
        <button
          onClick={() => onViewOrder(order.id)}
          className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-[#ee2b5b]/10 text-[#ee2b5b] rounded-lg text-xs font-black uppercase tracking-widest hover:bg-[#ee2b5b] hover:text-white transition-all"
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
    <div className="overflow-x-auto no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[600px] sm:min-w-full">
        {/* Header của bảng */}
        <thead>
          <tr className="text-left border-b border-slate-100">
            <th className="pb-4 sm:pb-6 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Mã đơn
            </th>
            <th className="pb-4 sm:pb-6 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell">
              Ngày đặt
            </th>
            <th className="pb-4 sm:pb-6 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Trạng thái
            </th>
            <th className="pb-4 sm:pb-6 text-right text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Thành tiền
            </th>
            <th className="pb-4 sm:pb-6 text-center text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span className="hidden sm:inline">Hành động</span>
              <span className="sm:hidden">Xem</span>
            </th>
          </tr>
        </thead>

        {/* Nội dung bảng */}
        <tbody className="divide-y divide-slate-50 text-xs sm:text-sm">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} onViewOrder={onViewOrder} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Component hiển thị danh sách đơn hàng phong cách Dashboard hiện đại
"use client";

import React, { FC } from "react";
import { Calendar, Package, ChevronRight } from "lucide-react";
import {
  ORDER_STATUS_MAP,
  StatusConfig,
} from "@/features/profile/constants/profile.constants";
import { MyOrder } from "@/types/profile";

interface OrdersTableProps {
  orders: MyOrder[];
  onViewOrder: (orderId: string) => void;
}

const StatusBadge: FC<{ status: string }> = ({ status }) => {
  const statusLower = status?.toLowerCase() || "";
  const { styles, label }: StatusConfig = ORDER_STATUS_MAP[statusLower] || {
    styles: "bg-slate-100 text-slate-700",
    label: status,
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles}`}>
      <span className="size-1.5 rounded-full bg-current mr-1.5 opacity-60"></span>
      {label}
    </span>
  );
};

export const OrdersTable: FC<OrdersTableProps> = ({ orders, onViewOrder }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="flex flex-col gap-4 relative z-10">
      {orders.map((order) => {
        const firstItem = order.items?.[0];
        const itemName = firstItem?.productName || "Đơn hàng hoa";
        const itemCount = order.items?.length || 1;

        return (
          <div
            key={order.id}
            onClick={() => onViewOrder(order.id)}
            className="group bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#EE2B5B]/20 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
          >
            {/* 1. Order Details */}
            <div className="flex-1 min-w-0 flex flex-col gap-1 sm:gap-1.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#EE2B5B] uppercase tracking-wider">
                  #{order.id.slice(-8).toUpperCase()}
                </span>
                <StatusBadge status={order.status} />
              </div>
              
              <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-[#EE2B5B] transition-colors">
                {itemName}
                {itemCount > 1 && ` và ${itemCount - 1} sản phẩm khác`}
              </h3>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="opacity-70" />
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Package size={14} className="opacity-70" />
                  <span>{order.paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "Chuyển khoản / Ví"}</span>
                </div>
              </div>
            </div>

            {/* 2. Price & Action */}
            <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50 sm:pl-6 sm:border-l sm:border-slate-100">
              <div className="flex flex-col items-start sm:items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                  Tổng thanh toán
                </span>
                <span className="text-lg sm:text-xl font-black text-slate-900">
                  {formatPrice(order.totalPrice)}
                </span>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewOrder(order.id);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#EE2B5B] hover:text-white transition-all shadow-sm group/btn"
              >
                <span>Chi tiết</span>
                <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

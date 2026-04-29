import React from "react";
import { Clock, Truck, CheckCircle2, XCircle } from "lucide-react";
import { OrderResponse } from "@/types/order";

interface OrderStatisticsProps {
  orders: OrderResponse[];
}

export const OrderStatistics: React.FC<OrderStatisticsProps> = ({ orders }) => {
  const stats = [
    {
      label: "Đang chờ",
      icon: Clock,
      count: orders.filter((o) => o.status === "pending").length,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
      borderColor: "border-orange-200",
    },
    {
      label: "Đang giao",
      icon: Truck,
      count: orders.filter((o) => o.status === "processing").length,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      label: "Hoàn tất",
      icon: CheckCircle2,
      count: orders.filter((o) => o.status === "completed").length,
      bgColor: "bg-[#13ec5b]/20",
      textColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      label: "Đã hủy",
      icon: XCircle,
      count: orders.filter((o) => o.status === "cancelled").length,
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      borderColor: "border-red-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`flex items-center gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border shadow-sm hover:shadow-md transition-shadow ${stat.borderColor}`}
          >
            <div className={`${stat.bgColor} ${stat.textColor} p-2.5 rounded-xl shrink-0`}>
              <Icon size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider truncate">
                {stat.label}
              </p>
              <p className="text-lg sm:text-xl font-black text-slate-900">
                {stat.count}
                <span className="text-xs font-bold text-slate-400 ml-1">đơn</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

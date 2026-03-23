import React from "react";
import { Clock, Truck, CheckCircle2, XCircle } from "lucide-react";
import { OrderResponse } from "../types/order";

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
    },
    {
      label: "Đang giao",
      icon: Truck,
      count: orders.filter((o) => o.status === "processing").length,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      label: "Hoàn tất",
      icon: CheckCircle2,
      count: orders.filter((o) => o.status === "completed").length,
      bgColor: "bg-[#13ec5b]/20",
      textColor: "text-green-600",
    },
    {
      label: "Đã hủy",
      icon: XCircle,
      count: orders.filter((o) => o.status === "cancelled").length,
      bgColor: "bg-red-100",
      textColor: "text-red-600",
    },
  ];

  return (
    <div className="flex flex-wrap gap-6 mb-10">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex-1 min-w-50"
          >
            <div className={`${stat.bgColor} ${stat.textColor} p-2 rounded-xl`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">
                {stat.label}
              </p>
              <p className="text-xl font-black">{stat.count} Đơn</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

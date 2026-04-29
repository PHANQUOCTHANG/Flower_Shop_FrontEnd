import React from "react";
import { Package, CheckCircle2, EyeOff, FileText } from "lucide-react";

interface MetaProp {
  total?: number;
  statusCounts?: {
    active?: number;
    hidden?: number;
    draft?: number;
  };
}

export const ProductStats = ({ data }: { data?: MetaProp }) => {
  const stats = [
    {
      label: "Tổng sản phẩm",
      icon: Package,
      count: data?.total ?? 0,
      bgColor: "bg-[#13ec5b]/15",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      suffix: "sp",
    },
    {
      label: "Đang hoạt động",
      icon: CheckCircle2,
      count: data?.statusCounts?.active ?? 0,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
      suffix: "sp",
    },
    {
      label: "Đang ẩn",
      icon: EyeOff,
      count: data?.statusCounts?.hidden ?? 0,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
      borderColor: "border-yellow-200",
      suffix: "sp",
    },
    {
      label: "Bản nháp",
      icon: FileText,
      count: data?.statusCounts?.draft ?? 0,
      bgColor: "bg-slate-100",
      textColor: "text-slate-500",
      borderColor: "border-slate-200",
      suffix: "sp",
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
                <span className="text-xs font-bold text-slate-400 ml-1">{stat.suffix}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

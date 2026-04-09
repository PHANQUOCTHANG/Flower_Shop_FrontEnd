import React from "react";
import { Package, ShoppingBag, Trash2 } from "lucide-react";
import { StatCard } from "./StatCard";

interface metaProp {
  total?: number;
  statusCounts?: {
    active?: number;
    hidden?: number;
    draft?: number;
  };
}

export const ProductStats = ({ data }: { data?: metaProp }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        label="Tổng sản phẩm"
        value={data?.total?.toString() || "0"}
        icon={Package}
        colorClass="bg-[#13ec5b]/10 text-[#13ec5b]"
      />
      <StatCard
        label="Đang hoạt động"
        value={data?.statusCounts?.active?.toString() || "0"}
        colorClass="text-[#13ec5b]"
        icon={ShoppingBag}
      />
      <StatCard
        label="Ẩn"
        value={data?.statusCounts?.hidden?.toString() || "0"}
        colorClass="text-red-500"
        icon={Trash2}
      />
      <StatCard
        label="Nháp"
        value={data?.statusCounts?.draft?.toString() || "0"}
        colorClass="text-slate-400"
        icon={Package}
      />
    </div>
  );
};

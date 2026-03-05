import React from "react";
import { Package, ShoppingBag, Trash2 } from "lucide-react";
import { StatCard } from "./StatCard";

export const ProductStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        label="Tổng sản phẩm"
        value="156"
        icon={Package}
        colorClass="bg-[#13ec5b]/10 text-[#13ec5b]"
      />
      <StatCard
        label="Đang kinh doanh"
        value="142"
        colorClass="text-[#13ec5b]"
        icon={ShoppingBag}
      />
      <StatCard
        label="Hết hàng"
        value="8"
        colorClass="text-red-500"
        icon={Trash2}
      />
      <StatCard
        label="Ngừng bán"
        value="6"
        colorClass="text-slate-400"
        icon={Package}
      />
    </div>
  );
};

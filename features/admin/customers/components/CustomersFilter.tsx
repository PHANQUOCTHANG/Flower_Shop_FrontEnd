"use client";

import { Filter } from "lucide-react";

interface CustomersFilterProps {
  selectedTier: string;
  onTierChange: (tier: string) => void;
}

const TIER_OPTIONS = ["Tất cả", "VIP", "Vàng", "Bạc", "Đồng"];

export const CustomersFilter = ({
  selectedTier,
  onTierChange,
}: CustomersFilterProps) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Nút lựa chọn hạng */}
      <div className="flex flex-wrap gap-2">
        {TIER_OPTIONS.map((tier) => (
          <button
            key={tier}
            onClick={() => onTierChange(tier)}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all border ${
              selectedTier === tier
                ? "bg-[#13ec5b] text-[#102216] border-[#13ec5b]"
                : "bg-slate-50 border-slate-200 text-slate-500"
            }`}
          >
            {tier}
          </button>
        ))}
      </div>

      {/* Chỉ dẫn sắp xếp */}
      <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
        <Filter size={16} />
        <span>Sắp xếp: Chi tiêu giảm dần</span>
      </div>
    </div>
  );
};

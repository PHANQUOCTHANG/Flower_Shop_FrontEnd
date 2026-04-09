"use client";

import { Star } from "lucide-react";

interface TierBadgeProps {
  totalSpent: number;
}

// Xác định hạng thẻ dựa trên tổng chi tiêu
const getTierFromSpent = (totalSpent: number): string => {
  if (totalSpent >= 20000000) return "VIP";
  if (totalSpent >= 10000000) return "Vàng";
  if (totalSpent >= 5000000) return "Bạc";
  return "Đồng";
};

export const TierBadge = ({ totalSpent }: TierBadgeProps) => {
  const tier = getTierFromSpent(totalSpent);

  // Kiểu dáng cho từng hạng
  const styles: Record<string, string> = {
    VIP: "bg-purple-100 text-purple-700 border-purple-200",
    Vàng: "bg-amber-100 text-amber-700 border-amber-200",
    Bạc: "bg-slate-100 text-slate-700 border-slate-200",
    Đồng: "bg-orange-100 text-orange-700 border-orange-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[tier]}`}
    >
      <Star size={10} fill="currentColor" />
      {tier}
    </span>
  );
};

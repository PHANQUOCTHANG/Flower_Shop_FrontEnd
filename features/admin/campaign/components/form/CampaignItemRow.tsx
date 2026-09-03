"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { formatCurrency } from "@/utils/format";
import { CampaignItemDraft } from "../../hooks/useCampaignForm";

interface CampaignItemRowProps {
  item: CampaignItemDraft;
  onChange: (patch: Partial<CampaignItemDraft>) => void;
  onRemove: () => void;
  isEditMode?: boolean;
}

export function CampaignItemRow({ item, onChange, onRemove, isEditMode = false }: CampaignItemRowProps) {
  const recalcSalePrice = (discountValue: number, discountType: "PERCENTAGE" | "FIXED_AMOUNT") => {
    const value = discountType === "PERCENTAGE"
      ? Math.round(item.productPrice * (1 - discountValue / 100))
      : Math.max(0, item.productPrice - discountValue);
    onChange({ discountValue, discountType, salePrice: value });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
      <div className="relative size-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
        <OptimizedImage fill src={item.productThumbnail} alt={item.productName} sizes="48px" />
      </div>

      <div className="min-w-[140px] flex-1">
        <p className="text-sm font-bold text-slate-900 truncate">{item.productName}</p>
        <p className="text-xs text-slate-500">Giá gốc: {formatCurrency(item.productPrice)}</p>
      </div>

      <div className="flex items-center gap-1.5">
        <select
          value={item.discountType}
          onChange={(e) => recalcSalePrice(item.discountValue, e.target.value as "PERCENTAGE" | "FIXED_AMOUNT")}
          className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white"
        >
          <option value="PERCENTAGE">%</option>
          <option value="FIXED_AMOUNT">VNĐ</option>
        </select>
        <input
          type="number"
          min={0}
          value={item.discountValue}
          onChange={(e) => recalcSalePrice(Number(e.target.value), item.discountType)}
          className="w-20 text-xs border border-slate-200 rounded-lg px-2 py-1.5"
        />
      </div>

      <div className="flex flex-col gap-0.5">
        <label className="text-[10px] text-slate-400 font-bold uppercase">Giá sale</label>
        <input
          type="number"
          min={0}
          value={item.salePrice}
          onChange={(e) => onChange({ salePrice: Number(e.target.value) })}
          className={`w-28 text-xs border rounded-lg px-2 py-1.5 ${
            item.salePrice >= item.productPrice ? "border-amber-400 bg-amber-50" : "border-slate-200"
          }`}
        />
      </div>

      <div className="flex flex-col gap-0.5">
        <label className="text-[10px] text-slate-400 font-bold uppercase">Giới hạn SL</label>
        <input
          type="number"
          min={item.soldQuantity ?? 1}
          placeholder="Không giới hạn"
          value={item.limitQuantity ?? ""}
          onChange={(e) => onChange({ limitQuantity: e.target.value === "" ? undefined : Number(e.target.value) })}
          className="w-24 text-xs border border-slate-200 rounded-lg px-2 py-1.5 placeholder:text-slate-300"
        />
      </div>

      {isEditMode && (
        <div className="flex flex-col gap-0.5">
          <label className="text-[10px] text-slate-400 font-bold uppercase">Đã bán</label>
          <span className="text-xs font-bold text-slate-600 px-2 py-1.5">{item.soldQuantity ?? 0}</span>
        </div>
      )}

      <button
        onClick={onRemove}
        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto"
        title="Xóa khỏi chiến dịch"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

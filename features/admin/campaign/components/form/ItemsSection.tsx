"use client";

import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { CampaignItemRow } from "./CampaignItemRow";
import { ProductPickerModal } from "./ProductPickerModal";
import { CampaignItemDraft } from "../../hooks/useCampaignForm";
import { Product } from "@/types/product";

interface ItemsSectionProps {
  items: CampaignItemDraft[];
  onAddProduct: (product: Product) => void;
  onUpdateItem: (productId: string, patch: Partial<CampaignItemDraft>) => void;
  onRemoveItem: (productId: string) => void;
  isEditMode?: boolean;
}

export function ItemsSection({
  items,
  onAddProduct,
  onUpdateItem,
  onRemoveItem,
  isEditMode = false,
}: ItemsSectionProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
            Sản phẩm khuyến mãi
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {items.length} sản phẩm đã thêm vào chiến dịch
          </p>
        </div>
        <button
          onClick={() => setIsPickerOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-slate-700 transition-all"
        >
          <PlusCircle size={16} />
          Thêm sản phẩm
        </button>
      </div>

      {items.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl">
          Chưa có sản phẩm nào — chiến dịch cần ít nhất 1 sản phẩm mới kích hoạt được
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <CampaignItemRow
              key={item.productId}
              item={item}
              onChange={(patch) => onUpdateItem(item.productId, patch)}
              onRemove={() => onRemoveItem(item.productId)}
              isEditMode={isEditMode}
            />
          ))}
        </div>
      )}

      <ProductPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        selectedProductIds={items.map((i) => i.productId)}
        onSelect={onAddProduct}
      />
    </div>
  );
}

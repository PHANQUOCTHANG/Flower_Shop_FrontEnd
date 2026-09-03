"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Search, Plus, Check } from "lucide-react";
import { productService } from "@/features/admin/products/services/productService";
import { useCategories } from "@/features/admin/categories/hooks/useCategories";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { formatCurrency } from "@/utils/format";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { Product } from "@/types/product";

interface ProductPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProductIds: string[];
  onSelect: (product: Product) => void;
}

export function ProductPickerModal({
  isOpen,
  onClose,
  selectedProductIds,
  onSelect,
}: ProductPickerModalProps) {
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const debouncedSearch = useDebouncedCallback((val: string) => setSearch(val), 400);

  const { categories } = useCategories();

  const { data, isFetching } = useQuery({
    queryKey: ["admin", "campaigns", "product-picker", search, category],
    queryFn: () =>
      productService.getProducts({
        search: search || undefined,
        category: category || undefined,
        limit: 20,
        status: "active",
      }),
    enabled: isOpen,
    placeholderData: (prev) => prev,
  });

  if (!isOpen) return null;

  const products = data?.products ?? [];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">
            Thêm sản phẩm vào chiến dịch
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                debouncedSearch(e.target.value);
              }}
              placeholder="Tìm tên sản phẩm..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#13ec5b]/40"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="shrink-0 max-w-[140px] py-2.5 px-3 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#13ec5b]/40"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {isFetching && products.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">Đang tải...</div>
          ) : products.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">Không tìm thấy sản phẩm</div>
          ) : (
            products.map((product) => {
              const isSelected = selectedProductIds.includes(product.id);
              return (
                <button
                  key={product.id}
                  disabled={isSelected}
                  onClick={() => onSelect(product)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-colors text-left ${
                    isSelected ? "bg-[#13ec5b]/10 cursor-default" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="relative size-11 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                    <OptimizedImage fill src={product.thumbnailUrl} alt={product.name} sizes="44px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{product.name}</p>
                    <p className="text-xs text-slate-500">{formatCurrency(product.price)}</p>
                  </div>
                  {isSelected ? (
                    <Check size={18} className="text-[#13ec5b] shrink-0" />
                  ) : (
                    <Plus size={18} className="text-slate-400 shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#13ec5b] text-[#102216] rounded-xl text-sm font-black hover:scale-105 active:scale-95 transition-all"
          >
            Xong
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { CartItemResponse } from "@/features/cart/types/cart";

interface CartTableProps {
  items: CartItemResponse[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export const CartTable: React.FC<CartTableProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  return (
    <div className="hidden md:flex flex-col rounded-2xl border border-[#e7cfd5] dark:border-white/10 bg-white dark:bg-white/5 shadow-sm overflow-hidden">
      <div className="overflow-y-auto max-h-[800px]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#fcf8f9] dark:bg-white/5 border-b border-[#e7cfd5] dark:border-white/10 sticky top-0">
            <tr>
              <th className="px-6 py-4 typo-caption-xs text-[#9a4c5f] dark:text-white/60">
                Sản phẩm
              </th>
              <th className="px-6 py-4 typo-caption-xs text-[#9a4c5f] dark:text-white/60">
                Đơn giá
              </th>
              <th className="px-6 py-4 typo-caption-xs text-[#9a4c5f] dark:text-white/60 text-center">
                Số lượng
              </th>
              <th className="px-6 py-4 typo-caption-xs text-[#9a4c5f] dark:text-white/60">
                Thành tiền
              </th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7cfd5] dark:divide-white/5">
            {items.map((item) => (
              <tr
                key={item.id}
                className="group hover:bg-[#ee2b5b]/[0.02] transition-colors"
              >
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative size-20 rounded-xl overflow-hidden border border-[#e7cfd5] dark:border-white/10 bg-gray-100 shrink-0">
                      <img
                        src={item.product.thumbnailUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <p className="typo-label text-[#1b0d11] dark:text-white leading-tight mb-1">
                        {item.product.name}
                      </p>
                      <p className="typo-caption-xs text-[#9a4c5f] dark:text-white/50">
                        {item.product.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 typo-body-sm whitespace-nowrap">
                  {formatCurrency(item.product.price)}
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center border border-[#e7cfd5] dark:border-white/20 rounded-xl overflow-hidden bg-white dark:bg-[#221015]">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-[#ee2b5b]/10"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-bold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-[#ee2b5b]/10"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className="font-black text-[#ee2b5b] whitespace-nowrap">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </td>
                <td className="px-6 py-6 text-right">
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-[#9a4c5f] hover:text-red-500 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

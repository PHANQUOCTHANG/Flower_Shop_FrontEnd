import React from "react";
import { Trash2 } from "lucide-react";
import { CartItemResponse } from "@/features/cart/types/cart";
import { formatCurrency } from "@/utils/format";
import { QuantityControl } from "@/features/cart/components/QuantityControl";

interface CartItemsMobileProps {
  items: CartItemResponse[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export const CartItemsMobile: React.FC<CartItemsMobileProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  return (
    <div className="md:hidden space-y-4 max-h-[800px] overflow-y-auto pr-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-[#e7cfd5] dark:border-white/10 shadow-sm space-y-4"
        >
          {/* Header: ảnh + tên + xóa */}
          <div className="flex gap-4">
            <img
              src={item.product.thumbnailUrl}
              alt={item.product.name}
              className="size-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start gap-2">
                <p className="typo-label leading-tight">{item.product.name}</p>
                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  aria-label="Xóa sản phẩm"
                  className="text-[#9a4c5f] hover:text-red-500 shrink-0 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="typo-caption-xs text-[#9a4c5f] dark:text-white/50 mt-1">
                {item.product.id}
              </p>
              <p className="typo-label text-[#ee2b5b] mt-2">
                {formatCurrency(item.product.price)}
              </p>
            </div>
          </div>

          {/* Footer: quantity control + thành tiền */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5">
            <QuantityControl
              quantity={item.quantity}
              productId={item.product.id}
              onUpdateQuantity={onUpdateQuantity}
              variant="mobile"
            />

            <div className="text-right">
              <p className="typo-caption-xs text-gray-400">Thành tiền</p>
              <p className="typo-label text-[#ee2b5b]">
                {formatCurrency(item.product.price * item.quantity)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
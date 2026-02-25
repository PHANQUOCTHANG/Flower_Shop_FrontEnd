import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "./CartTable";
import { formatCurrency } from "@/utils/format";

interface CartItemsMobileProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
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
          <div className="flex gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="size-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start gap-2">
                <p className="typo-label leading-tight">{item.name}</p>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-[#9a4c5f] shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="typo-caption-xs text-[#9a4c5f] dark:text-white/50 mt-1">
                {item.variant}
              </p>
              <p className="typo-label text-[#ee2b5b] mt-2">
                {formatCurrency(item.price)}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5">
            <div className="flex items-center border border-[#e7cfd5] dark:border-white/20 rounded-lg overflow-hidden h-9 bg-white dark:bg-[#221015]">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="px-3 h-full"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center typo-caption-xs font-bold">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="px-3 h-full"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <div className="text-right">
              <p className="typo-caption-xs text-gray-400">Thành tiền</p>
              <p className="typo-label text-[#ee2b5b]">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

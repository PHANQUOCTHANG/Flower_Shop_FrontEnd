import React from "react";
import { Minus, Plus, ShoppingCart, Zap, Phone, MessageCircle } from "lucide-react";

interface ActionButtonsProps {
  quantity: number;
  onQuantityChange: (type: "inc" | "dec") => void;
  onAddToCart: (quantity: number) => void;
  isLoading?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  quantity,
  onQuantityChange,
  onAddToCart,
  isLoading = false,
}) => {
  return (
    <>
      <div className="mt-6 space-y-4">
        {/* Số lượng label */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Số lượng</span>
          <span className="text-xs text-gray-400">Còn hàng</span>
        </div>

        {/* Quantity + Add to cart */}
        <div className="flex items-center gap-3">
          {/* Quantity picker */}
          <div className="flex items-center gap-1 h-12 px-2 rounded-2xl border-2 border-gray-200 bg-white shadow-sm">
            <button
              onClick={() => onQuantityChange("dec")}
              disabled={isLoading || quantity <= 1}
              className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-40 text-gray-600"
              aria-label="Giảm số lượng"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center text-base font-bold text-gray-900 select-none">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange("inc")}
              disabled={isLoading}
              className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-40 text-gray-600"
              aria-label="Tăng số lượng"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to cart button */}
          <button
            onClick={() => onAddToCart(quantity)}
            disabled={isLoading}
            className="flex-1 h-12 flex items-center justify-center gap-2 rounded-2xl border-2 border-[#13ec5b] text-[#0d8a36] font-bold text-sm hover:bg-[#13ec5b] hover:text-[#0d1b12] transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            {isLoading ? "Đang thêm..." : "Thêm vào giỏ"}
          </button>
        </div>

        {/* Order now — primary CTA */}
        {/* <button
          disabled={isLoading}
          className="hidden sm:flex w-full h-14 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#13ec5b] to-[#0ecf50] text-[#0d1b12] font-black text-[15px] shadow-lg shadow-[#13ec5b]/30 hover:shadow-[#13ec5b]/50 hover:from-[#0ecf50] hover:to-[#0bbf48] transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={() => onAddToCart(quantity)}
        >
          <Zap className="w-5 h-5 fill-current" />
          ĐẶT HOA NGAY
        </button> */}

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[11px] text-gray-400 font-medium tracking-wider uppercase">hoặc liên hệ</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Contact row */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href="tel:0931838465"
            className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-2xl hover:border-[#13ec5b] hover:text-[#13ec5b] transition-all group shadow-sm"
          >
            <Phone className="w-4 h-4 group-hover:text-[#13ec5b] text-[#13ec5b] transition-colors" />
            <span className="text-[13px] font-semibold">0931 838 465</span>
          </a>
          <a
            href="https://zalo.me/0931838465"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-2xl hover:border-[#0068ff] hover:text-[#0068ff] transition-all group shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-[#0068ff] transition-colors" />
            <span className="text-[13px] font-semibold">Zalo</span>
          </a>
        </div>
      </div>

      {/* Mobile Sticky Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-8px_32px_rgba(0,0,0,0.08)] sm:hidden z-50">
        <button
          disabled={isLoading}
          onClick={() => onAddToCart(quantity)}
          className="w-full bg-gradient-to-r from-[#13ec5b] to-[#0ecf50] text-[#0d1b12] font-black text-[15px] py-4 rounded-2xl shadow-lg shadow-[#13ec5b]/30 flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-60 transition-all"
        >
          <Zap className="w-5 h-5 fill-current" />
          ĐẶT HOA NGAY
        </button>
      </div>
    </>
  );
};

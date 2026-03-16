import React from "react";
import { ShoppingCart, ShieldCheck, Heart } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { CartItemResponse } from "@/features/cart/types/cart";

interface OrderSummaryCheckoutProps {
  cartItems: CartItemResponse[];
  subtotal: number;
  total: number;
  onConfirmOrder: () => void;
  isLoading?: boolean;
}

// Component hiển thị tóm tắt đơn hàng ở checkout
export const OrderSummaryCheckout: React.FC<OrderSummaryCheckoutProps> = ({
  cartItems,
  subtotal,
  total,
  onConfirmOrder,
  isLoading = false,
}) => {
  return (
    <div className="lg:sticky lg:top-10 space-y-6">
      <div className="bg-white dark:bg-[#221015] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#ee2b5b]/5 border border-[#ee2b5b]/10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <ShoppingCart className="w-32 h-32 -rotate-12 translate-x-8 -translate-y-8" />
        </div>

        {/* Header */}
        <h3 className="typo-heading-md mb-8 border-b border-gray-100 dark:border-white/5 pb-5 flex justify-between items-center relative z-10">
          Đơn hàng của bạn
          <span className="bg-[#ee2b5b]/10 text-[#ee2b5b] typo-label-sm px-3 py-1 rounded-full">
            {cartItems.length} món
          </span>
        </h3>

        {/* Danh sách sản phẩm */}
        <div className="space-y-6 mb-10 relative z-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-5 group">
              {/* Hình ảnh sản phẩm */}
              <div className="size-20 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 flex-shrink-0 shadow-sm bg-gray-50">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Thông tin sản phẩm */}
              <div className="flex-1 min-w-0 py-1">
                <p className="typo-body leading-snug line-clamp-2 group-hover:text-[#ee2b5b] transition-colors">
                  {item.name}
                </p>
                <p className="typo-label-sm text-gray-400 mt-2">
                  Số lượng: {item.quantity}
                </p>
                <p className="typo-heading-sm text-[#ee2b5b] mt-1">
                  {formatCurrency(item.product.price)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tính toán tổng tiền */}
        <div className="space-y-4 pt-8 border-t border-dashed border-gray-200 dark:border-white/10 relative z-10">
          {/* Tạm tính */}
          <div className="flex justify-between items-center typo-caption-xs">
            <span className="text-gray-400">Tạm tính</span>
            <span className="font-bold">{formatCurrency(subtotal)}</span>
          </div>

          {/* Phí vận chuyển */}
          <div className="flex justify-between items-center typo-caption-xs">
            <span className="text-gray-400">Phí vận chuyển</span>
            <span className="text-green-500 font-bold">MIỄN PHÍ</span>
          </div>

          {/* Tổng cộng */}
          <div className="pt-8 mt-4 border-t-2 border-[#ee2b5b]/20">
            <div className="flex justify-between items-end">
              <span className="typo-heading-sm text-[#1b0d11] dark:text-white">
                Tổng cộng
              </span>
              <div className="text-right">
                <p className="typo-heading-lg text-[#ee2b5b] leading-none drop-shadow-sm">
                  {formatCurrency(total)}
                </p>
                <p className="typo-caption-xs text-gray-400 mt-2">
                  Đã bao gồm VAT 10%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nút xác nhận đặt hàng */}
        <button
          onClick={onConfirmOrder}
          disabled={isLoading}
          className={`w-full bg-[#ee2b5b] text-white py-6 rounded-2xl typo-button-lg mt-12 transition-all transform relative z-10 overflow-hidden group ${
            isLoading
              ? "opacity-60 cursor-not-allowed"
              : "hover:bg-[#d41f4d] hover:-translate-y-1 active:scale-[0.98] shadow-2xl shadow-[#ee2b5b]/30"
          }`}
        >
          <div className="relative z-10 flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>Xác nhận đặt hàng</span>
            )}
          </div>
          {!isLoading && (
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          )}
        </button>

        {/* Badges bảo mật */}
        <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
          <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <span className="typo-caption-xs text-gray-400">Bảo mật 100%</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
            <Heart className="w-5 h-5 text-[#ee2b5b]" />
            <span className="typo-caption-xs text-gray-400">Hoa tươi nhất</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { ShieldCheck, Heart } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { CartItemResponse } from "@/features/cart/types/cart";
import { useSettingStore } from "@/stores/setting.store";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface OrderSummaryCheckoutProps {
  cartItems: CartItemResponse[];
  subtotal: number;
  total: number;
  onConfirmOrder: () => void;
  isLoading?: boolean;
  paymentMethod: "bank" | "wallet" | "cod";
}

export const OrderSummaryCheckout: React.FC<OrderSummaryCheckoutProps> = ({
  cartItems,
  subtotal,
  total,
  onConfirmOrder,
  isLoading = false,
  paymentMethod,
}) => {
  const settings = useSettingStore((s) => s.settings);
  const shopPhone = settings?.shopConfig?.phone || "1900 6868";

  return (
    <div className="lg:sticky lg:top-6 space-y-4">
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-gray-100">
        {/* Header */}
        <h3 className="text-[15px] font-bold text-gray-800 mb-6 flex justify-between items-center">
          Đơn hàng của bạn ({cartItems.length})
        </h3>

        {/* Danh sách sản phẩm */}
        <div className="space-y-4 mb-8">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4">
              {/* Hình ảnh sản phẩm */}
              <div className="relative w-[70px] h-[70px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
                <OptimizedImage
                  src={item.product.thumbnailUrl}
                  alt={item.product.name}
                  fill
                  sizes="70px"
                />
              </div>

              {/* Thông tin sản phẩm */}
              <div className="flex-1 pt-0.5">
                <p className="text-[13px] font-bold text-gray-800 leading-tight line-clamp-2 mb-1">
                  {item.product.name}
                </p>
                <p className="text-[12px] text-gray-500 mb-0.5">
                  Số lượng: {item.quantity}
                </p>
                <p className="text-[14px] font-bold text-gray-900">
                  {formatCurrency(item.product.price)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tính toán tổng tiền */}
        <div className="space-y-3 pt-5 border-t border-dashed border-gray-200">
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-gray-400">Tạm tính</span>
            <span className="font-bold text-gray-800">
              {formatCurrency(subtotal)}
            </span>
          </div>

          <div className="flex justify-between items-center text-[13px]">
            <span className="text-gray-400">Phí vận chuyển</span>
            <span className="font-bold text-gray-800">Miễn phí</span>
          </div>

          {paymentMethod === "bank" && (
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-400">Khuyến mãi chuyển khoản (-5%)</span>
              <span className="font-bold text-[#EE2B5B]">
                - {formatCurrency(subtotal * 0.05)}
              </span>
            </div>
          )}

          {/* Tổng cộng */}
          <div className="pt-5 mt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-[15px] font-bold text-gray-800">
                Tổng thanh toán
              </span>
              <p className="text-[22px] font-black text-[#EE2B5B]">
                {formatCurrency(paymentMethod === "bank" ? subtotal * 0.95 : subtotal)}
              </p>
            </div>
          </div>
        </div>

        {/* Nút xác nhận đặt hàng */}
        <button
          onClick={onConfirmOrder}
          disabled={isLoading}
          className={`w-full bg-[#EE2B5B] text-white py-4 rounded-xl text-[14px] font-bold mt-7 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-[#EE2B5B]/20 ${
            isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#B3163B]"
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Đang xử lý...</span>
            </>
          ) : (
            <span>XÁC NHẬN ĐẶT HÀNG</span>
          )}
        </button>

        {/* Badges bảo mật */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-[#22C55E]">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Thanh toán an toàn 100%
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#EE2B5B]">
            <Heart className="w-4 h-4" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Hoa tươi trong ngày 100%
            </span>
          </div>
        </div>
      </div>

      {/* Support text below card */}
      <div className="text-center py-2">
        <p className="text-[12px] text-gray-400">
          Cần hỗ trợ? Gọi ngay <span className="text-[#EE2B5B] font-bold">{shopPhone}</span>
        </p>
      </div>
    </div>
  );
};

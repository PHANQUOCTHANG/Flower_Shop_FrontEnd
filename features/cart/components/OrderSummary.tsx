import React from "react";
import { ArrowRight, ShieldCheck, Truck, Heart } from "lucide-react";
import { formatCurrency } from "@/utils/format";

interface OrderSummaryProps {
 itemCount: number;
 subtotal: number;
 shippingFee: number;
 total: number;
 onCheckout: () => void;
 isCheckoutDisabled: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
 itemCount,
 subtotal,
 shippingFee,
 total,
 onCheckout,
 isCheckoutDisabled,
}) => {
 return (
 <aside className="w-full lg:w-[380px] space-y-6 lg:sticky lg:top-6">
 <div className="bg-white rounded-2xl border border-[#e7cfd5] p-5 sm:p-6 shadow-xl shadow-[#ee2b5b]/5">
 <h2 className="typo-heading-md mb-6 border-b border-[#e7cfd5] pb-4">
 Tóm tắt đơn hàng
 </h2>

 <div className="space-y-3 mb-6">
 <div className="flex justify-between items-center typo-caption-xs">
 <span className="text-[#9a4c5f] ">
 Tạm tính ({itemCount} sản phẩm)
 </span>
 <span className="font-bold">{formatCurrency(subtotal)}</span>
 </div>
 <div className="flex justify-between items-center typo-caption-xs">
 <span className="text-[#9a4c5f] ">
 Phí vận chuyển
 </span>
 <span className="text-green-500 font-bold">Miễn phí</span>
 </div>

 <div className="pt-4 border-t border-[#e7cfd5] mt-4">
 <div className="flex justify-between items-end">
 <span className="typo-heading-sm">Tổng cộng</span>
 <div className="text-right">
 <p className="typo-heading-lg text-[#ee2b5b] leading-none">
 {formatCurrency(total)}
 </p>
 <p className="typo-caption-xs text-gray-400 mt-1 uppercase">
 Đã bao gồm thuế VAT
 </p>
 </div>
 </div>
 </div>
 </div>

 <button
 onClick={onCheckout}
 disabled={isCheckoutDisabled}
 className="w-full bg-[#ee2b5b] disabled:bg-gray-300 hover:bg-[#ee2b5b]/90 text-white py-4 sm:py-5 rounded-2xl typo-button-lg shadow-xl shadow-[#ee2b5b]/20 transition-all flex items-center justify-center gap-3 group"
 >
 THANH TOÁN NGAY
 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
 </button>

 {/* Trust points */}
 <div className="mt-6 space-y-3 pt-6 border-t border-[#e7cfd5] ">
 <div className="flex items-center gap-3 typo-label-sm text-gray-500 ">
 <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
 Thanh toán bảo mật 100%
 </div>
 <div className="flex items-center gap-3 typo-label-sm text-gray-500 ">
 <Truck className="w-4 h-4 text-green-500 shrink-0" />
 Giao nhanh trong 2 giờ
 </div>
 <div className="flex items-center gap-3 typo-label-sm text-gray-500 ">
 <Heart className="w-4 h-4 text-green-500 shrink-0" />
 Cam kết hoa tươi mới
 </div>
 </div>
 </div>
 </aside>
 );
};



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
 <aside className="w-full lg:w-[360px] space-y-6 lg:sticky lg:top-6">
 <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
 <h2 className="text-base font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
 Tóm tắt đơn hàng
 </h2>

 <div className="space-y-4 mb-6">
 <div className="flex justify-between items-center text-[13px]">
 <span className="text-[#e91e63]">
 Tổng tiền hàng
 </span>
 <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
 </div>
 <div className="flex justify-between items-center text-[13px]">
 <span className="text-[#e91e63]">
 Phí vận chuyển (tạm tính)
 </span>
 <span className="text-gray-900 font-bold">Miễn phí</span>
 </div>

 <div className="pt-6 border-t border-gray-100 mt-4">
 <div className="flex justify-between items-center">
 <span className="text-sm font-bold text-gray-900">Tổng cộng</span>
 <div className="text-right">
 <p className="text-2xl font-black text-[#e91e63] leading-none">
 {formatCurrency(total)}
 </p>
 <p className="text-[9px] text-[#e91e63] mt-1 font-medium">
 ĐÃ BAO GỒM VAT
 </p>
 </div>
 </div>
 </div>
 </div>

 <button
 onClick={onCheckout}
 disabled={isCheckoutDisabled}
 className="w-full bg-[#e91e63] disabled:bg-gray-300 hover:bg-[#db2777] text-white py-4 rounded-xl text-sm font-bold shadow-lg shadow-[#e91e63]/20 transition-all flex items-center justify-center gap-2 group active:scale-95"
 >
 TIẾN HÀNH ĐẶT HÀNG <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
 </button>

 {/* Trust points */}
 <div className="mt-8 space-y-3 pt-6 border-t border-gray-100">
 <div className="flex items-center gap-3 text-[11px] text-gray-500 font-medium">
 <ShieldCheck className="w-4 h-4 text-[#22c55e] shrink-0" />
 Thanh toán an toàn & bảo mật
 </div>
 <div className="flex items-center gap-3 text-[11px] text-gray-500 font-medium">
 <Truck className="w-4 h-4 text-[#22c55e] shrink-0" />
 Giao hàng nhanh trong 2h
 </div>
 <div className="flex items-center gap-3 text-[11px] text-gray-500 font-medium">
 <Heart className="w-4 h-4 text-[#22c55e] shrink-0" />
 Hoa tươi mới mỗi ngày
 </div>
 </div>
 </div>
 </aside>
 );
};



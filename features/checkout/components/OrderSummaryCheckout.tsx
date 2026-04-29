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
 <div className="lg:sticky lg:top-6 space-y-4">
 <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
 
 {/* Header */}
 <h3 className="text-base font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4 flex justify-between items-center">
 Đơn hàng của bạn ({cartItems.length})
 </h3>

 {/* Danh sách sản phẩm */}
 <div className="space-y-5 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
 {cartItems.map((item) => (
 <div key={item.id} className="flex gap-4">
 {/* Hình ảnh sản phẩm */}
 <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
 <img
 src={item.product.thumbnailUrl}
 alt={item.product.name}
 className="w-full h-full object-cover"
 />
 </div>

 {/* Thông tin sản phẩm */}
 <div className="flex-1 min-w-0">
 <p className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2 mb-1">
 {item.product.name}
 </p>
 <p className="text-[11px] text-gray-500 mb-1">
 Số lượng: {item.quantity}
 </p>
 <p className="text-[13px] font-black text-gray-900">
 {formatCurrency(item.product.price)}
 </p>
 </div>
 </div>
 ))}
 </div>

 {/* Tính toán tổng tiền */}
 <div className="space-y-3 pt-6 border-t border-dashed border-gray-200">
 {/* Tạm tính */}
 <div className="flex justify-between items-center text-[13px]">
 <span className="text-gray-500">Tạm tính</span>
 <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
 </div>

 {/* Phí vận chuyển */}
 <div className="flex justify-between items-center text-[13px]">
 <span className="text-gray-500">Phí vận chuyển</span>
 <span className="font-bold text-gray-900">Miễn phí</span>
 </div>

 {/* Khuyến mãi */}
 <div className="flex justify-between items-center text-[13px]">
 <span className="text-gray-500">Khuyến mãi chuyển khoản (-5%)</span>
 <span className="font-bold text-[#e91e63]">- {formatCurrency(subtotal * 0.05)}</span>
 </div>

 {/* Tổng cộng */}
 <div className="pt-6 mt-4 border-t border-gray-100">
 <div className="flex justify-between items-center">
 <span className="text-sm font-bold text-gray-900">
 Tổng thanh toán
 </span>
 <p className="text-2xl font-black text-[#e91e63]">
 {formatCurrency(total - subtotal * 0.05)}
 </p>
 </div>
 </div>
 </div>

 {/* Nút xác nhận đặt hàng */}
 <button
 onClick={onConfirmOrder}
 disabled={isLoading}
 className={`w-full bg-[#e91e63] text-white py-4 rounded-xl text-sm font-bold mt-8 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-[#e91e63]/20 ${
 isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#db2777]"
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
 <div className="flex items-center gap-2 text-[#22c55e]">
 <ShieldCheck className="w-4 h-4" />
 <span className="text-[10px] font-bold text-gray-500 uppercase">Thanh toán an toàn 100%</span>
 </div>
 <div className="flex items-center gap-2 text-[#e91e63]">
 <Heart className="w-4 h-4" />
 <span className="text-[10px] font-bold text-gray-500 uppercase">Hoa tươi trong ngày 100%</span>
 </div>
 </div>
 </div>

 {/* Support Banner */}
 <div className="bg-[#e91e63]/10 rounded-xl p-4 text-center">
 <p className="text-[13px] text-[#e91e63]">
 Cần hỗ trợ? Gọi ngay <span className="font-bold">1900 1234</span>
 </p>
 </div>
 </div>
 );
};



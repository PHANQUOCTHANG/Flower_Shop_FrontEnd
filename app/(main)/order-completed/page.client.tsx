"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Truck, Image as ImageIcon } from "lucide-react";
import { checkoutEventTracker } from "@/features/checkout/hooks/checkoutEventTracker";
import { useCartStore } from "@/stores/cart.store";
import { useOrderById } from "@/features/admin/orders/hooks/useOrder";

// Handle format currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const FlowerDecoration = ({ size = 100 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 20C55 20 60 15 60 10C60 4.5 55.5 0 50 0C44.5 0 40 4.5 40 10C40 15 45 20 50 20Z" fill="#13ec5b" />
    <path d="M80 50C80 45 85 40 90 40C95.5 40 100 44.5 100 50C100 55.5 95.5 60 90 60C85 60 80 55 80 50Z" fill="#13ec5b" />
    <path d="M50 80C45 80 40 85 40 90C40 95.5 44.5 100 50 100C55.5 100 60 95.5 60 90C60 85 55 80 50 80Z" fill="#13ec5b" />
    <path d="M20 50C20 55 15 60 10 60C4.5 60 0 55.5 0 50C0 44.5 4.5 40 10 40C15 40 20 45 20 50Z" fill="#13ec5b" />
    <circle cx="50" cy="50" r="15" fill="#13ec5b" />
    <circle cx="50" cy="50" r="5" fill="#fcfbf9" />
    <path d="M28.7868 28.7868C25.2513 25.2513 19.5228 25.2513 15.9873 28.7868C12.4518 32.3223 12.4518 38.0508 15.9873 41.5863" stroke="#13ec5b" strokeWidth="15" strokeLinecap="round" />
    <path d="M71.2132 28.7868C74.7487 25.2513 80.4772 25.2513 84.0127 28.7868C87.5482 32.3223 87.5482 38.0508 84.0127 41.5863" stroke="#13ec5b" strokeWidth="15" strokeLinecap="round" />
    <path d="M71.2132 71.2132C74.7487 74.7487 80.4772 74.7487 84.0127 71.2132C87.5482 67.6777 87.5482 61.9492 84.0127 58.4137" stroke="#13ec5b" strokeWidth="15" strokeLinecap="round" />
    <path d="M28.7868 71.2132C25.2513 74.7487 19.5228 74.7487 15.9873 71.2132C12.4518 67.6777 12.4518 61.9492 15.9873 58.4137" stroke="#13ec5b" strokeWidth="15" strokeLinecap="round" />
  </svg>
);

export default function OrderCompletedPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { setItems } = useCartStore();
  const [isLoading, setIsLoading] = React.useState(true);
  
  const orderId = searchParams.get("id");
  const { order, isLoading: isOrderLoading } = useOrderById(orderId);

  useEffect(() => {
    // 1. Clear cart store items
    setItems([]);

    // 2. Invalidate cart query để refetch
    queryClient.invalidateQueries({ queryKey: ["cart"] });

    // 3. Track checkout completion
    checkoutEventTracker.trackStepStart("completed");

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
      checkoutEventTracker.trackStepComplete("completed");
    };
  }, [setItems, queryClient]);


  const isDataLoading = isLoading || isOrderLoading;

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1b0d11] transition-all duration-300 font-sans antialiased relative overflow-hidden flex flex-col items-center py-10 px-4">
      {/* Background decorations based on image */}
      <div className="fixed top-20 -left-10 opacity-5 pointer-events-none">
         <FlowerDecoration size={200} />
      </div>
      <div className="fixed bottom-10 right-0 opacity-5 pointer-events-none">
         <FlowerDecoration size={250} />
      </div>

      <div className={`w-full max-w-xl transition-all duration-700 relative z-10 ${isDataLoading ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}>
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="size-16 rounded-full bg-[#13ec5b]/10 flex items-center justify-center text-[#13ec5b] mb-4">
            <CheckCircle2 size={32} className="fill-[#13ec5b] text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 tracking-tight">
            Đặt hàng thành công!
          </h1>
          <div className="px-4 py-1.5 bg-[#13ec5b]/10 rounded-full text-[#0d9e3e] text-xs font-bold tracking-widest uppercase">
            Mã đơn hàng: {order?.slug ? `#${order.slug.toUpperCase()}` : `#FLWR-${orderId?.substring(0,5).toUpperCase() || '12345'}`}
          </div>
        </div>

        {/* Next Step Box */}
        <div className="bg-[#f0fdf4] border border-[#13ec5b]/20 rounded-2xl p-5 mb-6 flex items-start gap-4">
          <div className="mt-1.5 size-2 rounded-full bg-[#13ec5b] animate-pulse shrink-0 shadow-[0_0_8px_#13ec5b]"></div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Bước tiếp theo</h3>
            <p className="text-xs sm:text-sm text-[#0d9e3e] leading-relaxed">Người thợ cắm hoa của chúng tôi sẽ gọi cho bạn trong vòng 10 phút để xác nhận đơn hàng.</p>
          </div>
          <div className="size-6 bg-white rounded-full shrink-0 shadow-sm border border-[#13ec5b]/10 mt-1"></div>
        </div>

        {/* Order Summary Box */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h3 className="text-base font-black text-slate-900 mb-4">Tóm tắt đơn hàng</h3>
          
          {/* Products */}
          <div className="space-y-4 mb-6">
            {order?.items?.map((item: any, idx: number) => (
              <div key={idx} className="flex gap-4">
                <div className="size-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 shadow-sm border border-slate-50">
                  {item.product?.images?.[0] ? (
                    <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <ImageIcon className="w-full h-full p-6 text-slate-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-slate-900 truncate mb-1">{item.productName || item.product?.name}</h4>
                  <p className="text-xs text-slate-500 mb-1">Số lượng: {item.quantity < 10 ? `0${item.quantity}` : item.quantity}</p>
                  <p className="text-sm font-black text-slate-900">{formatPrice(item.price)}</p>
                </div>
              </div>
            )) || (
              <div className="flex gap-4">
                <div className="size-20 rounded-xl bg-[#e5e0f5] shrink-0"></div>
                <div className="flex-1 flex flex-col justify-center gap-2">
                   <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                   <div className="h-3 bg-slate-100 rounded w-1/4"></div>
                   <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                </div>
              </div>
            )}
          </div>

          <div className="h-px w-full bg-slate-100 mb-6 border-dashed border-t border-slate-200"></div>

          {/* Info Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-[10px] font-black text-[#0d9e3e] uppercase tracking-widest mb-2">GIAO ĐẾN</p>
              <p className="text-xs font-bold text-slate-900 mb-1">{order?.name || "Khách hàng"}</p>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                {order?.shippingAddress || "Đang cập nhật"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black text-[#0d9e3e] uppercase tracking-widest mb-2">LỜI CHÚC TRÊN THIỆP</p>
              <p className="text-xs text-slate-500 italic leading-relaxed line-clamp-3">
                "{order?.note || "Không có lời chúc kèm theo."}"
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-slate-100 mb-6 border-dashed border-t border-slate-200"></div>

          {/* Costs */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium text-slate-500">Tạm tính:</p>
              <p className="text-xs font-bold text-slate-900">{formatPrice(order?.totalPrice || 0)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium text-slate-500">Phí giao hàng:</p>
              <p className="text-xs font-bold text-slate-900">Miễn phí</p>
            </div>
            <div className="flex justify-between items-center pt-3 mt-1 border-t border-slate-100">
              <p className="text-sm font-black text-slate-900">Tổng cộng:</p>
              <p className="text-lg font-black text-[#13ec5b]">{formatPrice(order?.totalPrice || 0)}</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/profile?tab=orders")}
            className="w-full bg-[#13ec5b] text-white py-4 rounded-xl text-sm font-black flex items-center justify-center gap-2 hover:bg-[#10c94d] active:scale-[0.98] transition-all shadow-lg shadow-[#13ec5b]/20"
          >
            <Truck size={18} />
            Theo dõi đơn hàng
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-white border border-gray-200 text-slate-600 py-4 rounded-xl text-sm font-bold hover:bg-slate-50 active:scale-[0.98] transition-all"
          >
            Về trang chủ
          </button>
        </div>

        <p className="text-center text-[10px] font-bold text-slate-400 mt-8">
          Cần hỗ trợ? Gọi ngay <span className="text-[#13ec5b]">1900-FLWR</span>
        </p>

      </div>
    </div>
  );
}

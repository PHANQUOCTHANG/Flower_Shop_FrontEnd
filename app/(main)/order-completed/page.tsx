"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Gift,
  Truck,
  Heart,
  Phone,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProgressTracker } from "@/components/ui/ProgressTracker";
import { checkoutEventTracker } from "@/features/checkout/hooks/checkoutEventTracker";
import { useCartStore } from "@/stores/cart.store";

export default function OrderCompletedPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setItems } = useCartStore();
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    // 1. Clear cart store items
    setItems([]);

    // 2. Invalidate cart query để refetch (backend sẽ trả về empty cart)
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

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1b0d11] transition-all duration-300 font-sans antialiased">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Giỏ hàng", href: "/cart" },
            { label: "Thanh toán", href: "/checkout" },
            { label: "Đơn hàng thành công" },
          ]}
        />

        {/* Progress Tracker */}
        <ProgressTracker currentStep="completed" />

        <div className="flex flex-col items-center justify-center min-h-[600px] py-12">
          <div
            className={`max-w-2xl mx-auto text-center transition-all duration-700 ${
              isLoading ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            {/* Success Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative size-24 rounded-full bg-green-500 text-white flex items-center justify-center shadow-2xl shadow-green-500/30">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="typo-heading-lg text-3xl sm:text-4xl mb-4 text-green-500">
              Đơn hàng đã được xác nhận!
            </h1>
            <p className="typo-body-lg text-[#9a4c5f] mb-12 px-4">
              Cảm ơn bạn đã tin tưởng Flower Shop. Chúng tôi sẽ giao hoa tươi
              mới đến tay bạn sớm nhất có thể.
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-2xl p-6 border border-[#e7cfd5] shadow-sm hover:shadow-lg transition-all">
                <div className="size-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="typo-label-lg mb-2">Thiệp lời nhắn</h3>
                <p className="typo-caption-xs text-[#9a4c5f] ">
                  Miễn phí và sẽ được gắn vào bó hoa
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#e7cfd5] shadow-sm hover:shadow-lg transition-all">
                <div className="size-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="typo-label-lg mb-2">Giao nhanh 2 giờ</h3>
                <p className="typo-caption-xs text-[#9a4c5f] ">
                  Hoặc đúng khung giờ bạn chọn
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#e7cfd5] shadow-sm hover:shadow-lg transition-all">
                <div className="size-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="typo-label-lg mb-2">Hoa tươi 100%</h3>
                <p className="typo-caption-xs text-[#9a4c5f] ">
                  Cam kết chất lượng cao nhất
                </p>
              </div>
            </div>

            {/* Support Section */}
            <div className="bg-[#ee2b5b]/5 rounded-2xl border border-[#ee2b5b]/20 p-8 mb-8">
              <p className="typo-label-sm text-[#ee2b5b] mb-3">
                Cần hỗ trợ gấp?
              </p>
              <p className="typo-heading-md text-[#ee2b5b] flex items-center justify-center gap-3 mb-4">
                <Phone className="w-5 h-5" /> 1900 1234
              </p>
              <p className="typo-caption-xs text-gray-400">
                Chúng tôi hoạt động 24/7 để phục vụ bạn
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => router.back()}
                className="flex-1 border-2 border-[#e7cfd5] text-[#4c9a66] hover:bg-[#4c9a66]/5 py-3 sm:py-4 rounded-xl sm:rounded-2xl typo-button transition-all flex items-center justify-center gap-2 group hover:border-[#4c9a66]/70"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                QUAY LẠI
              </button>

              <button
                onClick={() => router.push("/")}
                className="flex-1 bg-[#ee2b5b] hover:bg-[#ee2b5b]/90 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl typo-button-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#ee2b5b]/20 hover:shadow-xl"
              >
                TRANG CHỦ
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => router.push("/products")}
                className="flex-1 border-2 border-[#13ec5b] text-[#13ec5b] hover:bg-[#13ec5b]/5 py-3 sm:py-4 rounded-xl sm:rounded-2xl typo-button transition-all flex items-center justify-center gap-2 group hover:border-[#13ec5b]/70"
              >
                MUA THÊM
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

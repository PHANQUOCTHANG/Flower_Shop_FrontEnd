"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ArrowRight,
  Gift,
  Truck,
  Heart,
  Phone,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProgressTracker } from "@/components/ui/ProgressTracker";
import { checkoutEventTracker } from "@/features/checkout/hooks/checkoutEventTracker";

export default function OrderCompletedPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    checkoutEventTracker.trackStepStart("completed");

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
      checkoutEventTracker.trackStepComplete("completed");
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfbf9] dark:bg-[#1a0f12] text-[#1b0d11] dark:text-white transition-all duration-300 font-sans antialiased">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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
            <p className="typo-body-lg text-[#9a4c5f] dark:text-white/70 mb-12 px-4">
              Cảm ơn bạn đã tin tưởng Flower Shop. Chúng tôi sẽ giao hoa tươi
              mới đến tay bạn sớm nhất có thể.
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-[#e7cfd5] dark:border-white/10 shadow-sm hover:shadow-lg transition-all">
                <div className="size-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="typo-label-lg mb-2">Thiệp lời nhắn</h3>
                <p className="typo-caption-xs text-[#9a4c5f] dark:text-white/60">
                  Miễn phí và sẽ được gắn vào bó hoa
                </p>
              </div>

              <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-[#e7cfd5] dark:border-white/10 shadow-sm hover:shadow-lg transition-all">
                <div className="size-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="typo-label-lg mb-2">Giao nhanh 2 giờ</h3>
                <p className="typo-caption-xs text-[#9a4c5f] dark:text-white/60">
                  Hoặc đúng khung giờ bạn chọn
                </p>
              </div>

              <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-[#e7cfd5] dark:border-white/10 shadow-sm hover:shadow-lg transition-all">
                <div className="size-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="typo-label-lg mb-2">Hoa tươi 100%</h3>
                <p className="typo-caption-xs text-[#9a4c5f] dark:text-white/60">
                  Cam kết chất lượng cao nhất
                </p>
              </div>
            </div>

            {/* Support Section */}
            <div className="bg-[#ee2b5b]/5 dark:bg-[#ee2b5b]/10 rounded-2xl border border-[#ee2b5b]/20 p-8 mb-8">
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
            <div className="space-y-4">
              <button
                onClick={() => router.push("/")}
                className="w-full bg-[#ee2b5b] hover:bg-[#ee2b5b]/90 text-white py-4 rounded-2xl typo-button-lg transition-all flex items-center justify-center gap-3 group shadow-xl shadow-[#ee2b5b]/20"
              >
                QUAY LẠI TRANG CHỦ
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => router.push("/products")}
                className="w-full border-2 border-dashed border-[#e7cfd5] dark:border-white/10 text-[#ee2b5b] hover:border-[#ee2b5b] hover:bg-[#ee2b5b]/5 py-4 rounded-2xl typo-button transition-all flex items-center justify-center gap-3 group"
              >
                TIẾP TỤC MUA SẮM
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

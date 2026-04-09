"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { OrderStatusTracker } from "@/features/checkout/components";
import { useOrderStatus } from "@/features/checkout/hooks/useOrderStatus";

export default function OrderProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  useEffect(() => {
    console.log("[OrderProcessing] Page loaded with jobId:", jobId);
    if (!jobId) {
      router.push("/checkout");
    }
  }, [jobId, router]);

  const { status: socketStatus } = useOrderStatus({
    jobId: jobId || undefined,
    enabled: !!jobId,
    onStatusChange: (event) => {
      console.log("[OrderProcessing] Status changed:", event);
      if (event.status === "completed" && event.data?.orderId) {
        setTimeout(() => {
          router.push(`/order-completed?id=${event.data.orderId}`);
        }, 2000);
      }
    },
  });

  const handleRetry = () => {
    router.push("/checkout");
  };

  if (!jobId) {
    return null; // Đang redirect
  }

  return (
    <div
      className="min-h-screen text-[#1b0d11] font-sans antialiased transition-all duration-300"
      style={{ backgroundColor: "#fcfbf9" }}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Giỏ hàng", href: "/cart" },
            { label: "Thanh toán", href: "/checkout" },
            { label: "Đang xử lý đơn hàng" },
          ]}
        />

        {/* Content */}
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-full max-w-2xl">
            {/* Tracker Card */}
            <OrderStatusTracker
              status={socketStatus}
              isLoading={!socketStatus}
              onRetry={handleRetry}
            />

            {/* Navigation buttons — chỉ hiện khi thất bại */}
            {socketStatus?.status === "failed" && (
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <button
                  onClick={handleRetry}
                  className="w-full border-2 border-[#ee2b5b] text-[#ee2b5b] hover:bg-[#ee2b5b] hover:text-white font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Quay lại thanh toán
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="w-full border-2 border-dashed border-[#e7cfd5] text-[#9a4c5f] hover:border-[#9a4c5f] hover:bg-[#9a4c5f]/5 font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <Home className="w-4 h-4" />
                  Về trang chủ
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { OrderStatusTracker } from "@/features/checkout/components";
import { useOrderStatus, OrderStatusEvent } from "@/features/checkout/hooks/useOrderStatus";
import { useCheckoutStore } from "@/stores/checkout.store";
import { checkoutService } from "@/features/checkout/services/checkoutService";
import { useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/stores/cart.store";

export default function OrderProcessingPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { setItems } = useCartStore();

  // ── Params ──────────────────────────────────────────────────────────────────
  const urlJobId = searchParams.get("jobId");
  const mode = searchParams.get("mode"); // "submit" | null

  // ── Refs ────────────────────────────────────────────────────────────────────
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Tránh gọi API 2 lần trong React StrictMode (double-effect)
  const hasCalledApiRef = useRef(false);

  // ── State cho mode=submit ────────────────────────────────────────────────────
  // "calling"  : đang gọi API (đây là thời gian user nhìn thấy "Đang xử lý")
  // "queued"   : server trả jobId (Redis OK) → chuyển sang chờ socket
  // "completed": server trả orderId (Redis lỗi) hoặc socket báo xong
  // "failed"   : lỗi từ server hoặc network
  type SubmitStatus = "calling" | "queued" | "waiting_payment" | "completed" | "failed";
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("calling");
  const [resolvedOrderId, setResolvedOrderId] = useState<string | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(urlJobId);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // ── Cleanup timers on unmount ────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  // ── Guard: không có jobId (URL) và không phải mode=submit → về checkout ──────
  useEffect(() => {
    if (!urlJobId && mode !== "submit") {
      router.push("/checkout");
    }
  }, [urlJobId, mode, router]);

  // ── MODE=SUBMIT: gọi API ngay khi trang mount ────────────────────────────────
  useEffect(() => {
    if (mode !== "submit") return;
    if (hasCalledApiRef.current) return;
    hasCalledApiRef.current = true;

    const { pendingFormData, reset } = useCheckoutStore.getState();

    // Nếu không có form data (user F5 trang hoặc truy cập thẳng URL)
    if (!pendingFormData) {
      router.push("/checkout");
      return;
    }

    // Xóa khỏi store ngay (chỉ dùng 1 lần, tránh re-submit nếu F5)
    reset();

    // ★ Gọi API
    checkoutService
      .createOrder(pendingFormData)
      .then((response) => {
        // ★ VNPay: redirect sang cổng thanh toán VNPay
        if (response.data?.vnpayUrl) {
          const newWindow = window.open(response.data.vnpayUrl, "_blank");
          
          if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
            // Popup chặn → Fallback mở ở tab hiện tại
            window.location.href = response.data.vnpayUrl;
          } else {
            // Mở tab mới thành công → Giữ lại trang hiện tại và chờ socket
            const orderId = response.data?.orderId || response.data?.id;
            if (orderId) {
              setResolvedOrderId(orderId);
              setSubmitStatus("waiting_payment");
            }
          }
          return;
        }

        if (response.data?.jobId) {
          setActiveJobId(response.data.jobId);
          setSubmitStatus("queued");
        } else {
          const orderId = response.data?.orderId || response.data?.id;
          if (orderId) {
            setResolvedOrderId(orderId);
            setSubmitStatus("completed");
          } else {
            setErrorMsg("Không nhận được mã đơn hàng từ server.");
            setSubmitStatus("failed");
          }
        }
      })
      .catch((err: any) => {
        setErrorMsg(err?.message || "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
        setSubmitStatus("failed");
      });
  }, [mode, router]);

  // ── Socket listener cho Job xử lý (order:status) ─────────────────────────────
  const { status: socketStatus } = useOrderStatus({
    jobId: activeJobId || undefined,
    enabled: !!activeJobId,
    onStatusChange: (event: OrderStatusEvent) => {
      if (event.status === "completed" && event.data?.orderId) {
        setResolvedOrderId(event.data.orderId);
        setSubmitStatus("completed");
      }
      if (event.status === "failed") {
        setErrorMsg(event.message || "Đặt hàng thất bại.");
        setSubmitStatus("failed");
      }
    },
  });

  // ── Socket listener cho VNPay IPN (order:payment_updated) ───────────────────
  useEffect(() => {
    if (submitStatus !== "waiting_payment" || !resolvedOrderId) return;
    
    import("@/lib/socket").then(({ getSocket, initializeSocket }) => {
      import("@/stores/auth.store").then(({ useAuthStore }) => {
        const token = useAuthStore.getState().accessToken;
        if (!token) return;

        const socket = getSocket() || initializeSocket(token);
        if (!socket.connected) socket.connect();

        const handlePaymentUpdate = (event: any) => {
          if (event.orderId === resolvedOrderId && event.paymentStatus === "paid") {
            setSubmitStatus("completed");
          }
        };

        socket.on("order:payment_updated", handlePaymentUpdate);

        return () => {
          socket.off("order:payment_updated", handlePaymentUpdate);
        };
      });
    });
  }, [submitStatus, resolvedOrderId]);

  // ── Khi completed → dọn cart + redirect sang order-completed ─────────────────
  useEffect(() => {
    if (submitStatus !== "completed" || !resolvedOrderId) return;

    // Dọn giỏ hàng & cache
    setItems([]);
    queryClient.invalidateQueries({ queryKey: ["cart"] });
    queryClient.invalidateQueries({ queryKey: ["orders", "my-orders"] });

    // Redirect ngay
    redirectTimerRef.current = setTimeout(() => {
      router.push(`/order-completed?id=${resolvedOrderId}`);
    }, 1000); // 1s nhỏ để animation "completed" hiển thị trước
  }, [submitStatus, resolvedOrderId, router, setItems, queryClient]);

  // ── Map state sang OrderStatusEvent để truyền vào OrderStatusTracker ─────────
  const displayStatus: OrderStatusEvent | null = (() => {
    if (mode !== "submit") return socketStatus;
    switch (submitStatus) {
      case "calling":
        return { jobId: "direct", status: "processing", message: "Đang gửi đơn hàng lên server...", data: undefined };
      case "queued":
        return { jobId: activeJobId || "direct", status: "queued", message: "Đơn hàng đang chờ xử lý...", data: undefined };
      case "waiting_payment":
        return { jobId: "direct", status: "processing", message: "Đang chờ bạn thanh toán VNPay ở cửa sổ mới...", data: undefined };
      case "completed":
        return { jobId: "direct", status: "completed", message: "Đặt hàng thành công!", data: resolvedOrderId ? { orderId: resolvedOrderId, totalPrice: 0 } : undefined };
      case "failed":
        return { jobId: "direct", status: "failed", message: errorMsg || "Đặt hàng thất bại.", data: undefined };
      default:
        return null;
    }
  })();

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleRetry = () => router.push("/checkout");

  if (!urlJobId && mode !== "submit") {
    return null; // Đang redirect về checkout
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
              status={displayStatus}
              isLoading={!displayStatus}
              onRetry={handleRetry}
            />

            {/* Navigation buttons — chỉ hiện khi thất bại */}
            {(displayStatus?.status === "failed") && (
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <button
                  onClick={handleRetry}
                  className="w-full border-2 border-[#EE2B5B] text-[#EE2B5B] hover:bg-[#EE2B5B] hover:text-white font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Quay lại thanh toán
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="w-full border-2 border-dashed border-[#FCE9ED] text-[#D11E48] hover:border-[#D11E48] hover:bg-[#D11E48]/5 font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 group"
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

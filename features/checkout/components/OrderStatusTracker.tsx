"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Package,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { OrderStatusEvent } from "@/features/checkout/hooks/useOrderStatus";

// ─── Types ───────────────────────────────────────────────────────────────────
interface OrderStatusTrackerProps {
  status: OrderStatusEvent | null;
  isLoading?: boolean;
  onRetry?: () => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const STATUS_STEPS = [
  { key: "queued", label: "Chờ xử lý", icon: "📋" },
  { key: "processing", label: "Đang xử lý", icon: "⚙️" },
  { key: "completed", label: "Hoàn thành", icon: "✅" },
];

// Mapping trạng thái sang màu theo theme website
const STATUS_CONFIG = {
  queued: {
    dotColor: "bg-[#ee2b5b]",
    ringColor: "ring-[#ee2b5b]/30",
    textColor: "text-[#ee2b5b]",
  },
  processing: {
    dotColor: "bg-[#ee2b5b]",
    ringColor: "ring-[#ee2b5b]/30",
    textColor: "text-[#ee2b5b]",
  },
  completed: {
    dotColor: "bg-green-500",
    ringColor: "ring-green-500/30",
    textColor: "text-green-600",
  },
  failed: {
    dotColor: "bg-red-500",
    ringColor: "ring-red-500/30",
    textColor: "text-red-600",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  status,
  isLoading,
  onRetry,
}) => {
  const router = useRouter();

  if (!status && !isLoading) return null;

  const isCompleted = status?.status === "completed";
  const isFailed = status?.status === "failed";
  const currentStatus = (status?.status || "queued") as keyof typeof STATUS_CONFIG;
  const config = STATUS_CONFIG[currentStatus];
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <div className="w-full">
      {/* ─── Main Card ─────────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl border border-[#e7cfd5] bg-white overflow-hidden shadow-xl">
        {/* Decorative top bar */}
        <div
          className={`h-1.5 w-full ${isFailed ? "bg-red-500" : isCompleted ? "bg-green-500" : "bg-[#ee2b5b]"}`}
        />

        {/* Floral watermark decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 opacity-[0.03] pointer-events-none select-none text-[18rem] leading-none">
          🌸
        </div>

        <div className="relative p-8 sm:p-12">
          {/* ─── Header ────────────────────────────────────────────────────── */}
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div
                className={`size-10 rounded-xl flex items-center justify-center ${
                  isFailed
                    ? "bg-red-50"
                    : isCompleted
                      ? "bg-green-50"
                      : "bg-[#ee2b5b]/10"
                }`}
              >
                <Package
                  className={`w-5 h-5 ${
                    isFailed
                      ? "text-red-500"
                      : isCompleted
                        ? "text-green-500"
                        : "text-[#ee2b5b]"
                  }`}
                />
              </div>
              <h2 className="typo-heading-lg text-[#1b0d11]">
                Xử lý đơn hàng
              </h2>
            </div>

            {status?.jobId && (
              <p className="typo-caption text-[#9a4c5f]">
                Mã theo dõi:{" "}
                <span className="font-mono font-bold text-[#1b0d11]">
                  {status.jobId.slice(0, 20)}...
                </span>
              </p>
            )}
          </div>

          {/* ─── Progress Timeline ─────────────────────────────────────────── */}
          <div className="mb-10">
            <div className="flex justify-between items-start relative">
              {/* Đường nền */}
              <div className="absolute top-5 left-[calc(50%/3)] right-[calc(50%/3)] h-[2px] bg-[#e7cfd5] z-0" />

              {STATUS_STEPS.map((step, index) => {
                const isStepDone = currentStepIndex > index;
                const isStepActive = step.key === currentStatus && !isFailed;
                const stepConfig = STATUS_CONFIG[step.key as keyof typeof STATUS_CONFIG];

                return (
                  <div
                    key={step.key}
                    className="flex flex-col flex-1 items-center relative z-10"
                  >
                    {/* Đường nối trước */}
                    {index > 0 && (
                      <div
                        className={`absolute top-5 right-1/2 w-full h-[2px] transition-all duration-500 ${
                          isStepDone || isStepActive
                            ? isFailed
                              ? "bg-red-300"
                              : isCompleted
                                ? "bg-green-400"
                                : "bg-[#ee2b5b]"
                            : "bg-[#e7cfd5]"
                        }`}
                      />
                    )}

                    {/* Dot */}
                    <div
                      className={`relative mb-3 size-10 rounded-full flex items-center justify-center font-semibold text-white shadow-md transition-all duration-300 ${
                        isStepActive || isStepDone
                          ? `${stepConfig.dotColor} ring-4 ${stepConfig.ringColor} scale-110`
                          : "bg-[#e7cfd5] text-[#9a4c5f] scale-100"
                      }`}
                    >
                      {isStepDone && step.key !== "completed" ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="text-base leading-none">{step.icon}</span>
                      )}
                    </div>

                    {/* Label */}
                    <p
                      className={`typo-caption text-center transition-all duration-300 ${
                        isStepActive
                          ? `${stepConfig.textColor} font-bold`
                          : isStepDone
                            ? "text-[#1b0d11]"
                            : "text-[#9a4c5f]"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Status Message ────────────────────────────────────────────── */}
          <div className="mb-8 text-center">
            <p className={`typo-subtitle transition-all duration-300 ${config.textColor}`}>
              {status?.message || "Đang vào hàng đợi..."}
            </p>
          </div>

          {/* ─── Loading Animation ─────────────────────────────────────────── */}
          {!isCompleted && !isFailed && (
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ee2b5b]/5 border border-[#ee2b5b]/20">
                <Loader2 className="w-4 h-4 text-[#ee2b5b] animate-spin" />
                <span className="typo-label-sm text-[#9a4c5f]">
                  Đang xử lý đơn hàng, vui lòng chờ...
                </span>
              </div>
            </div>
          )}

          {/* ─── Error State ───────────────────────────────────────────────── */}
          {isFailed && (
            <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-start gap-3 mb-5">
                <div className="size-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="typo-heading-sm text-red-900 mb-1">
                    Lỗi xử lý đơn hàng
                  </h4>
                  <p className="typo-body-sm text-red-700">
                    {status?.message || "Không thể xử lý đơn hàng. Vui lòng thử lại."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (onRetry) onRetry();
                  else window.location.reload();
                }}
                className="w-full mt-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white typo-button-sm rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                Thử lại
              </button>
            </div>
          )}

          {/* ─── Success State ─────────────────────────────────────────────── */}
          {isCompleted && status?.data && (
            <div className="space-y-5">
              {/* Success banner */}
              <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative size-16 rounded-full bg-green-500 text-white flex items-center justify-center shadow-xl shadow-green-500/30">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                  </div>
                </div>
                <h4 className="typo-heading-md text-green-900 mb-1">
                  Đơn hàng thành công!
                </h4>
                <p className="typo-body-sm text-[#9a4c5f]">
                  Cảm ơn bạn đã tin tưởng Flower Shop 🌸
                </p>
              </div>

              {/* Order summary card */}
              <div className="bg-[#fcfbf9] border border-[#e7cfd5] rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="typo-body text-[#9a4c5f]">Mã đơn hàng</span>
                  <span className="font-mono typo-label text-[#1b0d11]">
                    #{status.data.orderId}
                  </span>
                </div>
                <div className="border-t border-[#e7cfd5] pt-3 flex justify-between items-center">
                  <span className="typo-body text-[#9a4c5f]">Tổng tiền</span>
                  <span className="typo-heading-sm text-[#ee2b5b]">
                    {status.data.totalPrice.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => router.push("/")}
                  className="w-full bg-[#ee2b5b] hover:bg-[#ee2b5b]/90 text-white py-3.5 rounded-2xl typo-button-sm transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#ee2b5b]/20"
                >
                  Về trang chủ
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => router.push("/products")}
                  className="w-full border-2 border-dashed border-[#e7cfd5] text-[#ee2b5b] hover:border-[#ee2b5b] hover:bg-[#ee2b5b]/5 py-3.5 rounded-2xl typo-button-sm transition-all flex items-center justify-center gap-2 group"
                >
                  Tiếp tục mua sắm
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

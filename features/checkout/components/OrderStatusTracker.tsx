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
  Sparkles,
  ShoppingBag,
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
  {
    key:   "queued",
    label: "Tiếp nhận",
    desc:  "Đơn hàng đã ghi nhận",
    icon:  (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
      </svg>
    ),
  },
  {
    key:   "processing",
    label: "Xử lý",
    desc:  "Đang chuẩn bị đơn",
    icon:  (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    ),
  },
  {
    key:   "completed",
    label: "Hoàn thành",
    desc:  "Đơn hàng thành công",
    icon:  (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
] as const;

const STEP_INDEX: Record<string, number> = { queued: 0, processing: 1, completed: 2 };

// ─── Decorative background SVG ───────────────────────────────────────────────
const FloralBg: React.FC = () => (
  <svg
    viewBox="0 0 400 400"
    className="absolute inset-0 w-full h-full pointer-events-none select-none"
    aria-hidden="true"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <radialGradient id="fg1" cx="85%" cy="8%"  r="42%">
        <stop offset="0%"   stopColor="#EE2B5B" stopOpacity="0.07"/>
        <stop offset="100%" stopColor="#EE2B5B" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="fg2" cx="8%"  cy="90%" r="38%">
        <stop offset="0%"   stopColor="#ff6b9d" stopOpacity="0.06"/>
        <stop offset="100%" stopColor="#ff6b9d" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <rect width="400" height="400" fill="url(#fg1)"/>
    <rect width="400" height="400" fill="url(#fg2)"/>
    <ellipse cx="370" cy="25"  rx="65" ry="105" fill="#EE2B5B" fillOpacity=".022" transform="rotate(-30,370,25)"/>
    <ellipse cx="395" cy="80"  rx="50" ry="88"  fill="#EE2B5B" fillOpacity=".016" transform="rotate(30,395,80)"/>
    <ellipse cx="20"  cy="380" rx="72" ry="115" fill="#ff6b9d" fillOpacity=".022" transform="rotate(20,20,380)"/>
    <ellipse cx="60"  cy="355" rx="52" ry="82"  fill="#ff6b9d" fillOpacity=".016" transform="rotate(-20,60,355)"/>
    <circle cx="348" cy="348" r="2.5" fill="#EE2B5B" fillOpacity=".13"/>
    <circle cx="362" cy="334" r="1.5" fill="#EE2B5B" fillOpacity=".09"/>
    <circle cx="48"  cy="52"  r="2"   fill="#EE2B5B" fillOpacity=".10"/>
    <circle cx="35"  cy="67"  r="1.5" fill="#EE2B5B" fillOpacity=".07"/>
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────
export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  status,
  isLoading,
  onRetry,
}) => {
  const router = useRouter();
  if (!status && !isLoading) return null;

  const isCompleted      = status?.status === "completed";
  const isFailed         = status?.status === "failed";
  const currentStatus    = status?.status ?? "queued";
  const currentStepIndex = STEP_INDEX[currentStatus] ?? 0;

  return (
    <>
      {/* ── Keyframes ──────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap');

        @keyframes _ost-rise {
          from { opacity:0; transform:translateY(22px) scale(.975); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
        @keyframes _ost-pop {
          0%   { transform:scale(0)    rotate(-20deg); opacity:0; }
          65%  { transform:scale(1.18) rotate(5deg);  opacity:1; }
          100% { transform:scale(1)    rotate(0deg);  opacity:1; }
        }
        @keyframes _ost-pulse-ring {
          0%,100% { box-shadow:0 0 0 0   rgba(238,43,91,.5); }
          50%      { box-shadow:0 0 0 9px rgba(238,43,91,0);  }
        }
        @keyframes _ost-bar {
          from { transform:scaleX(0); }
          to   { transform:scaleX(1); }
        }
        @keyframes _ost-shimmer-bar {
          0%   { background-position:-200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes _ost-shimmer-text {
          0%   { background-position:-200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes _ost-spin {
          to { transform:rotate(360deg); }
        }
        @keyframes _ost-float {
          0%,100% { transform:translateY(0);   }
          50%      { transform:translateY(-7px); }
        }
        @keyframes _ost-burst {
          0%   { opacity:1; transform:translateY(0)     scale(1)   rotate(0deg);   }
          100% { opacity:0; transform:translateY(-52px) scale(.35) rotate(560deg); }
        }
        @keyframes _ost-shine {
          0%   { transform:translateX(-120%) skewX(-12deg); }
          100% { transform:translateX( 220%) skewX(-12deg); }
        }

        ._ost-rise       { animation:_ost-rise .55s cubic-bezier(.22,1,.36,1) both; }
        ._ost-pop        { animation:_ost-pop  .45s cubic-bezier(.34,1.56,.64,1) both; }
        ._ost-pulse-ring { animation:_ost-pulse-ring 2.2s ease-in-out infinite; }
        ._ost-bar-fill   { transform-origin:left; animation:_ost-bar .75s .12s cubic-bezier(.22,1,.36,1) both; }
        ._ost-spin       { animation:_ost-spin 8s linear infinite; }
        ._ost-float      { animation:_ost-float 3.2s ease-in-out infinite; }
        ._ost-top-bar    {
          background:linear-gradient(90deg,#EE2B5B,#ff8fab,#ffd6e3,#ff8fab,#EE2B5B);
          background-size:300% 100%;
          animation:_ost-shimmer-bar 4s linear infinite;
        }
        ._ost-shimmer-text {
          background:linear-gradient(90deg,#EE2B5B 20%,#ff8fab 50%,#EE2B5B 80%);
          background-size:200% auto;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:_ost-shimmer-text 3s linear infinite;
        }
        ._ost-b1 { animation:_ost-burst 1.1s .00s ease-out both; }
        ._ost-b2 { animation:_ost-burst 1.1s .07s ease-out both; }
        ._ost-b3 { animation:_ost-burst 1.1s .14s ease-out both; }
        ._ost-b4 { animation:_ost-burst 1.1s .21s ease-out both; }
        ._ost-b5 { animation:_ost-burst 1.1s .28s ease-out both; }
        ._ost-b6 { animation:_ost-burst 1.1s .35s ease-out both; }
        ._ost-b7 { animation:_ost-burst 1.1s .42s ease-out both; }
        ._ost-b8 { animation:_ost-burst 1.1s .49s ease-out both; }

        ._ost-btn-shine::after {
          content:'';
          position:absolute; inset:0;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);
          transform:translateX(-120%) skewX(-12deg);
          pointer-events:none;
        }
        ._ost-btn-shine:hover::after {
          animation:_ost-shine .65s ease-out forwards;
        }
      `}</style>

      <div className="w-full _ost-rise">
        {/* ── Card shell ──────────────────────────────────────────────── */}
        <div
          className="relative rounded-[32px] bg-white overflow-hidden"
          style={{
            boxShadow: [
              "0 0 0 1px rgba(238,43,91,.09)",
              "0 2px 6px rgba(238,43,91,.05)",
              "0 20px 52px -8px rgba(238,43,91,.13)",
              "0 48px 80px -20px rgba(0,0,0,.07)",
            ].join(","),
          }}
        >
          <FloralBg />

          {/* Animated rainbow bar */}
          <div
            className={`relative z-10 h-[3px] w-full ${isFailed ? "" : "_ost-top-bar"}`}
            style={isFailed ? { background: "linear-gradient(90deg,#f87171,#ef4444)" } : {}}
          />

          <div className="relative z-10 px-8 py-10 sm:px-12 sm:py-12">

            {/* ── Header ────────────────────────────────────────────── */}
            <div className="flex flex-col items-center text-center mb-10 gap-2">
              {/* Spinning orbit + icon */}
              <div className="relative flex items-center justify-center mb-3">
                <div
                  className="absolute size-[72px] rounded-full border border-dashed border-[#EE2B5B]/18 _ost-spin"
                  style={{ animationDirection: "reverse" }}
                />
                <div
                  className="size-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: isFailed
                      ? "linear-gradient(135deg,#fff0f0,#ffe8e8)"
                      : "linear-gradient(135deg,#fff0f4,#fce9ed)",
                    boxShadow: isFailed
                      ? "0 4px 16px rgba(239,68,68,.15),inset 0 1px 0 rgba(255,255,255,.8)"
                      : "0 4px 16px rgba(238,43,91,.15),inset 0 1px 0 rgba(255,255,255,.8)",
                  }}
                >
                  <Package className={`w-6 h-6 ${isFailed ? "text-red-500" : "text-[#EE2B5B]"}`} />
                </div>
              </div>

              <h2
                className="text-[1.6rem] font-bold tracking-tight text-[#1b0d11] leading-none"
                style={{ fontFamily: "'Cormorant Garamond','Playfair Display',Georgia,serif" }}
              >
                Xử lý đơn hàng
              </h2>

              {status?.jobId && (
                <p className="text-[10.5px] text-[#c4688a] tracking-wide mt-0.5">
                  Mã:{" "}
                  <span className="font-mono font-semibold text-[#1b0d11]">
                    {status.jobId.slice(0, 22)}…
                  </span>
                </p>
              )}
            </div>

            {/* ── Timeline (hidden once completed) ─────────────────── */}
            {!isCompleted && (
              <div className="mb-10">
                {/* Rail */}
                <div className="relative">
                  <div
                    className="absolute top-5 h-[2px] rounded-full"
                    style={{
                      left: "calc(16.66% + 20px)",
                      right: "calc(16.66% + 20px)",
                      background: "rgba(238,43,91,.1)",
                    }}
                  />
                  {!isFailed && currentStepIndex > 0 && (
                    <div
                      className="absolute top-5 h-[2px] rounded-full _ost-bar-fill"
                      style={{
                        left: "calc(16.66% + 20px)",
                        right:
                          currentStepIndex >= 2
                            ? "calc(16.66% + 20px)"
                            : "calc(50%)",
                        background: "linear-gradient(90deg,#EE2B5B,#ff8fab)",
                      }}
                    />
                  )}

                  <div className="relative flex justify-between">
                    {STATUS_STEPS.map((step, i) => {
                      const isDone   = !isFailed && currentStepIndex > i;
                      const isActive = !isFailed && currentStepIndex === i;

                      return (
                        <div key={step.key} className="flex flex-col items-center w-1/3 gap-2.5">
                          {/* Dot */}
                          <div
                            className={[
                              "relative size-10 rounded-full flex items-center justify-center z-10 transition-all duration-500",
                              isDone   ? "bg-[#EE2B5B] text-white shadow-md shadow-[#EE2B5B]/25"
                              : isActive ? "bg-[#EE2B5B] text-white _ost-pulse-ring"
                              : isFailed ? "bg-red-50 text-red-300 ring-1 ring-red-200"
                              : "bg-[#fdf0f4] text-[#dbaabb] ring-1 ring-[#FCE9ED]",
                            ].join(" ")}
                          >
                            {isDone
                              ? <CheckCircle2 className="w-5 h-5 _ost-pop" />
                              : step.icon
                            }
                            {isActive && (
                              <span className="absolute inset-0 rounded-full border border-[#EE2B5B] animate-ping opacity-25" />
                            )}
                          </div>

                          {/* Label */}
                          <div className="text-center">
                            <p className={[
                              "text-[11px] font-bold tracking-wide",
                              isActive ? "text-[#EE2B5B]"
                              : isDone  ? "text-[#1b0d11]"
                              : "text-[#cca8b8]",
                            ].join(" ")}>
                              {step.label}
                            </p>
                            <p className="hidden sm:block text-[10px] text-[#d8afc0] mt-0.5 leading-tight">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── Loading pill ──────────────────────────────────────── */}
            {!isCompleted && !isFailed && (
              <div className="flex justify-center mb-8">
                <div
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full"
                  style={{
                    background: "linear-gradient(135deg,rgba(238,43,91,.055),rgba(238,43,91,.025))",
                    border: "1px solid rgba(238,43,91,.14)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,.7)",
                  }}
                >
                  <Loader2 className="w-3.5 h-3.5 text-[#EE2B5B] animate-spin flex-shrink-0" />
                  <span className="text-[11px] font-semibold text-[#EE2B5B] tracking-wide">
                    Đang xử lý, vui lòng chờ trong giây lát…
                  </span>
                </div>
              </div>
            )}

            {/* ── Error ─────────────────────────────────────────────── */}
            {isFailed && (
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "linear-gradient(135deg,#fff9f9,#fff5f5)",
                  border: "1px solid rgba(239,68,68,.16)",
                  boxShadow: "0 4px 20px -4px rgba(239,68,68,.09)",
                }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="size-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg,#fee2e2,#fecaca)",
                      boxShadow: "0 2px 8px rgba(239,68,68,.2)",
                    }}
                  >
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-sm font-bold text-red-900 mb-1">
                      Không thể xử lý đơn hàng
                    </h4>
                    <p className="text-[11.5px] text-red-600 leading-relaxed">
                      {status?.message ?? "Đã xảy ra lỗi. Vui lòng thử lại hoặc liên hệ shop."}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => (onRetry ? onRetry() : window.location.reload())}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 group transition-all duration-200 active:scale-[.97]"
                  style={{
                    background: "linear-gradient(135deg,#ef4444,#dc2626)",
                    boxShadow: "0 6px 20px -4px rgba(239,68,68,.4)",
                  }}
                >
                  <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  Thử lại
                </button>
              </div>
            )}

            {/* ── Success ───────────────────────────────────────────── */}
            {isCompleted && status?.data && (
              <div className="space-y-5">

                {/* Confetti burst */}
                <div className="relative flex justify-center" style={{ height: 0 }}>
                  {[
                    { c:"_ost-b1", x:"-68px", color:"#EE2B5B",  s:"✦" },
                    { c:"_ost-b2", x:"-40px", color:"#ffb3c6",  s:"◆" },
                    { c:"_ost-b3", x:"-14px", color:"#EE2B5B",  s:"✦" },
                    { c:"_ost-b4", x:  "14px",color:"#ff8fab",  s:"◆" },
                    { c:"_ost-b5", x:  "40px",color:"#EE2B5B",  s:"✦" },
                    { c:"_ost-b6", x:  "68px",color:"#ffd6e3",  s:"◆" },
                    { c:"_ost-b7", x:"-54px", color:"#ff6b8a",  s:"✦" },
                    { c:"_ost-b8", x:  "54px",color:"#c4184a",  s:"◆" },
                  ].map((d, i) => (
                    <span
                      key={i}
                      className={`absolute text-sm select-none ${d.c}`}
                      style={{ color: d.color, marginLeft: d.x, top: "-10px" }}
                    >
                      {d.s}
                    </span>
                  ))}
                </div>

                {/* Hero block */}
                <div
                  className="rounded-2xl pt-10 pb-8 px-6 text-center relative overflow-hidden"
                  style={{
                    background: "linear-gradient(160deg,rgba(238,43,91,.055) 0%,rgba(255,182,198,.07) 55%,rgba(238,43,91,.04) 100%)",
                    border: "1px solid rgba(238,43,91,.11)",
                  }}
                >
                  {/* Glow */}
                  <div
                    className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-3xl"
                    style={{ background: "rgba(238,43,91,.11)" }}
                  />

                  {/* Check icon */}
                  <div className="flex justify-center mb-5 _ost-float">
                    <div
                      className="relative size-20 rounded-full flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg,#EE2B5B 0%,#c4184a 100%)",
                        boxShadow: [
                          "0 12px 36px -4px rgba(238,43,91,.5)",
                          "0 4px 12px -2px rgba(238,43,91,.3)",
                          "inset 0 2px 0 rgba(255,255,255,.22)",
                        ].join(","),
                      }}
                    >
                      <CheckCircle2 className="w-9 h-9 text-white _ost-pop" />
                      {/* Inner highlight */}
                      <span
                        className="absolute top-2.5 left-3.5 w-5 h-5 rounded-full opacity-25"
                        style={{ background: "radial-gradient(circle at 40% 35%,white,transparent 70%)" }}
                      />
                    </div>
                  </div>

                  <h3
                    className="text-[1.6rem] font-bold mb-1.5 leading-tight _ost-shimmer-text"
                    style={{ fontFamily: "'Cormorant Garamond','Playfair Display',Georgia,serif" }}
                  >
                    Đặt hàng thành công!
                  </h3>
                  <p className="text-[11.5px] text-[#c4688a] tracking-wide">
                    Cảm ơn bạn đã tin tưởng chọn Flower Shop 🌸
                  </p>
                </div>

                {/* Order info */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    border: "1px solid rgba(238,43,91,.11)",
                    boxShadow: "0 2px 14px -4px rgba(238,43,91,.07)",
                  }}
                >
                  <div
                    className="flex items-center justify-between px-5 py-3.5"
                    style={{
                      borderBottom: "1px solid rgba(238,43,91,.08)",
                      background: "#fffcfd",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#EE2B5B] opacity-60" />
                      <span className="text-[11px] text-[#c4688a] font-semibold tracking-wide">
                        MÃ ĐƠN HÀNG
                      </span>
                    </div>
                    <span
                      className="font-mono text-[12.5px] font-bold text-[#1b0d11] px-2.5 py-1 rounded-lg"
                      style={{ background: "rgba(238,43,91,.07)" }}
                    >
                      #{status.data.orderId}
                    </span>
                  </div>

                  <div
                    className="flex items-center justify-between px-5 py-4"
                    style={{
                      background: "linear-gradient(135deg,#fff9fb,#fdf6f8)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#EE2B5B] opacity-60" />
                      <span className="text-[11px] text-[#c4688a] font-semibold tracking-wide">
                        TỔNG THANH TOÁN
                      </span>
                    </div>
                    <span
                      className="text-[1.45rem] font-bold text-[#EE2B5B] leading-none"
                      style={{ fontFamily: "'Cormorant Garamond','Playfair Display',Georgia,serif" }}
                    >
                      {status.data.totalPrice.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {/* Primary */}
                  <button
                    onClick={() => router.push("/")}
                    className="relative overflow-hidden flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-200 active:scale-[.97] _ost-btn-shine"
                    style={{
                      background: "linear-gradient(135deg,#EE2B5B 0%,#c4184a 100%)",
                      boxShadow: "0 8px 24px -4px rgba(238,43,91,.42), 0 2px 6px -2px rgba(238,43,91,.22)",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        "0 12px 32px -4px rgba(238,43,91,.58), 0 4px 10px -2px rgba(238,43,91,.28)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        "0 8px 24px -4px rgba(238,43,91,.42), 0 2px 6px -2px rgba(238,43,91,.22)";
                    }}
                  >
                    Về trang chủ
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Secondary */}
                  <button
                    onClick={() => router.push("/products")}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-[#EE2B5B] transition-all duration-200 active:scale-[.97]"
                    style={{
                      border: "1.5px dashed rgba(238,43,91,.28)",
                      background: "rgba(238,43,91,.018)",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.border = "1.5px dashed rgba(238,43,91,.55)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(238,43,91,.05)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.border = "1.5px dashed rgba(238,43,91,.28)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(238,43,91,.018)";
                    }}
                  >
                    Mua thêm
                    <ArrowRight className="w-4 h-4 transition-transform" />
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};
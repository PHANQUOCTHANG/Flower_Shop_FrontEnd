import React from "react";
import { Clock, Camera, Gift, ShieldCheck } from "lucide-react";

const BADGES = [
  {
    icon: Clock,
    label: "Giao nhanh 2h",
    sub: "Nội thành",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: Camera,
    label: "Hình thật 100%",
    sub: "Cam kết",
    color: "text-sky-500",
    bg: "bg-sky-50",
    border: "border-sky-100",
  },
  {
    icon: Gift,
    label: "Tặng thiệp",
    sub: "Miễn phí",
    color: "text-rose-400",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
  {
    icon: ShieldCheck,
    label: "Bảo hành 24h",
    sub: "Hoàn tiền",
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
];

export const TrustBadges: React.FC = () => {
  return (
    <div className="mt-6 pt-5 border-t border-gray-100">
      <div className="grid grid-cols-4 gap-2.5">
        {BADGES.map((badge, i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-2 p-2.5 rounded-2xl border ${badge.bg} ${badge.border} text-center`}
          >
            <div className={`w-8 h-8 flex items-center justify-center rounded-xl ${badge.bg}`}>
              <badge.icon className={`w-4.5 h-4.5 ${badge.color}`} strokeWidth={2} />
            </div>
            <div>
              <p className={`text-[11px] font-bold ${badge.color} leading-tight`}>
                {badge.label}
              </p>
              <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{badge.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

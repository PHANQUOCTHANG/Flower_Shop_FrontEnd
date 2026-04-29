import React from "react";
import { Clock, Camera, Gift, ShieldCheck } from "lucide-react";

const BADGES = [
 { icon: Clock, label: "Giao nhanh 2h" },
 { icon: Camera, label: "Hình thật 100%" },
 { icon: Gift, label: "Tặng thiệp" },
 { icon: ShieldCheck, label: "Bảo hành 24h" },
];

export const TrustBadges: React.FC = () => {
 return (
 <div className="grid grid-cols-4 gap-2 py-5 mt-2">
 {BADGES.map((badge, i) => (
 <div key={i} className="flex flex-col items-center gap-2 text-center">
 <div className="w-6 h-6 flex items-center justify-center">
 <badge.icon className="w-5 h-5 text-[#13ec5b]" strokeWidth={2.5} />
 </div>
 <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium leading-tight">
 {badge.label}
 </span>
 </div>
 ))}
 </div>
 );
};



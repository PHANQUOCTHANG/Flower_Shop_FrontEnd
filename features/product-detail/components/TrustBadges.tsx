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
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-gray-100 mt-6">
 {BADGES.map((badge, i) => (
 <div key={i} className="flex flex-col items-center gap-1.5 text-center">
 <badge.icon className="w-5 h-5 text-[#13ec5b]" />
 <span className="typo-label-sm text-gray-500 ">
 {badge.label}
 </span>
 </div>
 ))}
 </div>
 );
};



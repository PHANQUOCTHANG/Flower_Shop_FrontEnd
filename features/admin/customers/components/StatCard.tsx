"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  label: string;
  value: string | number;
}

export const StatCard = ({
  icon: Icon,
  iconBgColor,
  iconColor,
  label,
  value,
}: StatCardProps) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${iconBgColor} ${iconColor}`}>
          <Icon size={22} />
        </div>
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
        {label}
      </p>
      <h3 className="text-slate-900 text-lg sm:text-2xl font-black mt-1">
        {value}
      </h3>
    </div>
  );
};

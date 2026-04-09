import React from "react";

interface OrderStatusTabsProps {
 tabs: Array<{ name: string; value: string; count: number }>;
 selectedStatus: string | undefined;
 onStatusChange: (status: string) => void;
}

export const OrderStatusTabs: React.FC<OrderStatusTabsProps> = ({
 tabs,
 selectedStatus,
 onStatusChange,
}) => {
 return (
 <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
 <div className="flex border-b border-slate-100 overflow-x-auto">
 {tabs.map((tab) => (
 <button
 key={tab.value}
 onClick={() => onStatusChange(tab.value)}
 className={`flex items-center gap-2 px-8 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
 selectedStatus ===
 (tab.value === "all" ? undefined : tab.value.toLowerCase())
 ? "border-[#13ec5b] text-[#13ec5b] bg-[#13ec5b]/5"
 : "border-transparent text-slate-400 hover:text-slate-600"
 }`}
 >
 {tab.name}
 <span
 className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
 selectedStatus ===
 (tab.value === "all" ? undefined : tab.value.toLowerCase())
 ? "bg-[#13ec5b] text-[#102216]"
 : "bg-slate-100 text-slate-500 "
 }`}
 >
 {tab.count}
 </span>
 </button>
 ))}
 </div>
 </div>
 );
};



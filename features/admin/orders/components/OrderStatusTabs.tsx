"use client";

import React, { useRef, useEffect } from "react";

interface Tab {
  name: string;
  value: string;
  count: number;
}

interface OrderStatusTabsProps {
  tabs: Tab[];
  selectedStatus: string | undefined;
  onStatusChange: (status: string) => void;
}

export const OrderStatusTabs: React.FC<OrderStatusTabsProps> = ({
  tabs,
  selectedStatus,
  onStatusChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Khi tab active thay đổi → cuộn tab đó vào vùng nhìn thấy
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current;
      const el = activeRef.current;

      const elLeft = el.offsetLeft;
      const elRight = elLeft + el.offsetWidth;
      const containerLeft = container.scrollLeft;
      const containerRight = containerLeft + container.clientWidth;

      if (elLeft < containerLeft) {
        // Tab bị khuất bên trái → cuộn sang trái
        container.scrollTo({ left: elLeft - 16, behavior: "smooth" });
      } else if (elRight > containerRight) {
        // Tab bị khuất bên phải → cuộn sang phải
        container.scrollTo({
          left: elRight - container.clientWidth + 16,
          behavior: "smooth",
        });
      }
    }
  }, [selectedStatus]);

  return (
    <div
      ref={containerRef}
      className="flex overflow-x-auto no-scrollbar px-1 scroll-smooth"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {tabs.map((tab) => {
        const isActive =
          selectedStatus === (tab.value === "all" ? undefined : tab.value.toLowerCase());

        return (
          <button
            key={tab.value}
            ref={isActive ? activeRef : null}
            onClick={() => onStatusChange(tab.value)}
            className={`flex items-center gap-2 px-4 sm:px-7 py-3.5 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap shrink-0 ${
              isActive
                ? "border-[#13ec5b] text-[#13ec5b] bg-[#13ec5b]/5"
                : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200"
            }`}
          >
            {tab.name}
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-black leading-none ${
                isActive
                  ? "bg-[#13ec5b] text-[#102216]"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
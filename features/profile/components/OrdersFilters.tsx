// Component bộ lọc và sắp xếp danh sách đơn hàng

"use client";

import React, { FC } from "react";
import {
  ORDER_STATUS_OPTIONS,
  ORDER_SORT_OPTIONS,
} from "@/features/profile/constants/profile.constants";

// Props của component
interface OrdersFiltersProps {
  // Trạng thái đơn hàng được chọn
  status: string;
  // Callback khi thay đổi trạng thái
  onStatusChange: (status: string) => void;
  // Loại sắp xếp được chọn
  sort: string;
  // Callback khi thay đổi sắp xếp
  onSortChange: (sort: string) => void;
}

// Component chọn select tùy chọn
interface CustomSelectProps {
  // Label của select
  label: string;
  // Giá trị hiện tại
  value: string;
  // Danh sách tùy chọn
  options: Array<{ value: string; label: string }>;
  // Callback khi thay đổi
  onChange: (value: string) => void;
}

const CustomSelect: FC<CustomSelectProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <div className="flex-1 space-y-2.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-[#ee2b5b] focus:ring-4 focus:ring-[#ee2b5b]/10 transition-all cursor-pointer shadow-sm appearance-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown icon */}
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Component chính
export const OrdersFilters: FC<OrdersFiltersProps> = ({
  status,
  onStatusChange,
  sort,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100/80">
      {/* Bộ lọc trạng thái */}
      <CustomSelect
        label="Trạng thái đơn hàng"
        value={status}
        options={ORDER_STATUS_OPTIONS}
        onChange={(newStatus) => {
          onStatusChange(newStatus);
        }}
      />

      {/* Bộ lọc sắp xếp */}
      <CustomSelect
        label="Sắp xếp hiển thị"
        value={sort}
        options={ORDER_SORT_OPTIONS}
        onChange={(newSort) => {
          onSortChange(newSort);
        }}
      />
    </div>
  );
};

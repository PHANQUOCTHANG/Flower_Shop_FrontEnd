// Component bộ lọc và sắp xếp danh sách đơn hàng
"use client";

import React, { FC } from "react";
import { Filter, ChevronDown } from "lucide-react";
import {
  ORDER_STATUS_OPTIONS,
  ORDER_SORT_OPTIONS,
} from "@/features/profile/constants/profile.constants";

interface OrdersFiltersProps {
  status: string;
  onStatusChange: (status: string) => void;
  sort: string;
  onSortChange: (sort: string) => void;
}

const CustomSelect: FC<{
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}> = ({ label, value, options, onChange }) => {
  return (
    <div className="flex-1 min-w-[180px]">
      <div className="relative group">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-4 pr-10 py-3 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-[#EE2B5B]/30 focus:ring-4 focus:ring-[#EE2B5B]/5 transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.02)] appearance-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 group-hover:text-[#EE2B5B] transition-colors">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};

export const OrdersFilters: FC<OrdersFiltersProps> = ({
  status,
  onStatusChange,
  sort,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
      <div className="hidden md:flex items-center gap-2 text-slate-400 mr-2">
        <Filter size={18} />
        <span className="text-xs font-bold uppercase tracking-widest">Bộ lọc</span>
      </div>
      
      <div className="flex flex-col sm:flex-row w-full gap-4">
        <CustomSelect
          label="Trạng thái"
          value={status}
          options={ORDER_STATUS_OPTIONS}
          onChange={onStatusChange}
        />
        <CustomSelect
          label="Sắp xếp"
          value={sort}
          options={ORDER_SORT_OPTIONS}
          onChange={onSortChange}
        />
      </div>
    </div>
  );
};

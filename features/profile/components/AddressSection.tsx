// Component section sổ địa chỉ

"use client";

import React, { FC } from "react";
import { Plus } from "lucide-react";

// Props của component
interface AddressSectionProps {
  // Callback khi click thêm địa chỉ
  onAddAddress?: () => void;
}

// Component chính
export const AddressSection: FC<AddressSectionProps> = ({ onAddAddress }) => {
  return (
    <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm animate-in slide-in-from-right-10 duration-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
          Sổ địa chỉ
        </h2>
        <button
          onClick={onAddAddress}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#ee2b5b] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#ee2b5b]/20 hover:scale-105 transition-all"
          type="button"
        >
          <Plus size={16} />
          Thêm địa chỉ
        </button>
      </div>

      {/* Trạng thái rỗng */}
      <div className="text-center py-16">
        <p className="text-slate-500 font-medium">
          Đang tải danh sách địa chỉ...
        </p>
      </div>
    </section>
  );
};

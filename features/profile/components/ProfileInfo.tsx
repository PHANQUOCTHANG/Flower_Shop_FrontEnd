// Component hiển thị thông tin cá nhân của người dùng

"use client";

import React, { FC } from "react";
import { Edit3 } from "lucide-react";

// Props của component
interface UserInfoField {
  // Nhãn trường
  label: string;
  // Giá trị hiển thị
  value: string;
}

interface ProfileInfoProps {
  // Danh sách các trường thông tin cần hiển thị
  fields: UserInfoField[];
  // Callback khi click nút chỉnh sửa
  onEdit?: () => void;
}

// Component chính
export const ProfileInfo: FC<ProfileInfoProps> = ({ fields, onEdit }) => {
  return (
    <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm animate-in slide-in-from-right-10 duration-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
          Hồ sơ cá nhân
        </h2>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#ee2b5b]/10 text-[#ee2b5b] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#ee2b5b] hover:text-white transition-all"
          type="button"
        >
          <Edit3 size={14} />
          Chỉnh sửa
        </button>
      </div>

      {/* Lưới hiển thị thông tin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
        {fields.map((field) => (
          <div key={field.label} className="space-y-2 group">
            {/* Nhãn */}
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {field.label}
            </p>

            {/* Giá trị */}
            <p className="text-base font-bold text-slate-800 group-hover:text-[#ee2b5b] transition-colors">
              {field.value}
            </p>

            {/* Underline hiệu ứng */}
            <div className="h-0.5 w-12 bg-slate-100 group-hover:w-full group-hover:bg-[#ee2b5b]/20 transition-all duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
};

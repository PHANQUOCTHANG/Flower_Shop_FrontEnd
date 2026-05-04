// Component hiển thị thông tin cá nhân của người dùng

"use client";

import React, { FC } from "react";
import { Edit3, User, Mail, Phone, UserCircle } from "lucide-react";

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
  const getIconForField = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("tên")) return <User className="text-[#13ec5b]" size={20} />;
    if (l.includes("email")) return <Mail className="text-[#13ec5b]" size={20} />;
    if (l.includes("thoại")) return <Phone className="text-[#13ec5b]" size={20} />;
    return <UserCircle className="text-[#13ec5b]" size={20} />;
  };

  return (
    <section className="animate-in fade-in duration-500 relative w-full">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#13ec5b]/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-10 -mt-10 z-0" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-10 gap-4 sm:gap-0 relative z-10">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
          Hồ sơ cá nhân
        </h2>
        <button
          onClick={onEdit}
          className="flex items-center justify-center sm:justify-start gap-2 px-5 py-2.5 bg-gradient-to-r from-[#13ec5b]/10 to-[#0fd34d]/10 text-[#0d9e3e] rounded-xl text-xs font-black uppercase tracking-widest hover:from-[#13ec5b] hover:to-[#0fd34d] hover:text-[#0d1b12] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all w-full sm:w-auto duration-300"
          type="button"
        >
          <Edit3 size={14} />
          Chỉnh sửa
        </button>
      </div>

      {/* Lưới hiển thị thông tin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative z-10">
        {fields.map((field) => (
          <div
            key={field.label}
            className="flex items-start gap-4 bg-slate-50/50 rounded-2xl p-5 sm:p-6 border border-slate-100 hover:border-[#13ec5b]/30 hover:bg-[#13ec5b]/5 transition-all duration-300 group"
          >
            {/* Icon Wrapper */}
            <div className="size-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 group-hover:border-[#13ec5b]/30">
              {getIconForField(field.label)}
            </div>
            
            <div className="space-y-1">
              {/* Nhãn */}
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {field.label}
              </p>

              {/* Giá trị */}
              <p className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-[#0d1b12] transition-colors break-words">
                {field.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

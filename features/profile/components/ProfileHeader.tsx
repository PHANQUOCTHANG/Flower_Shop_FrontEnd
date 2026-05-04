"use client";

import React, { FC } from "react";
import Image from "next/image";
import { LogOut } from "lucide-react";
import {
  PROFILE_NAV_ITEMS,
  ProfileTabType,
} from "@/features/profile/constants/profile.constants";

interface ProfileHeaderProps {
  userName: string | undefined;
  avatarUrl: string | undefined;
  activeTab: ProfileTabType;
  onTabChange: (tab: ProfileTabType) => void;
  onLogout: () => void;
  isLogoutLoading?: boolean;
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({
  userName,
  avatarUrl,
  activeTab,
  onTabChange,
  onLogout,
  isLogoutLoading = false,
}) => {
  const avatarSrc =
    avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || "User")}&background=13ec5b&color=0d1b12`;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Cover Photo */}
      <div className="w-full h-32 sm:h-48 md:h-56 bg-gradient-to-r from-[#13ec5b]/30 via-[#0fd34d]/20 to-[#13ec5b]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
      </div>

      {/* Avatar & Info */}
      <div className="flex flex-col items-center -mt-16 sm:-mt-20 z-10">
        <div className="size-32 sm:size-40 rounded-full p-1.5 bg-white shadow-xl relative group">
          <div className="size-full rounded-full border-4 border-slate-50 overflow-hidden bg-white relative">
            <Image
              src={avatarSrc}
              width={160}
              height={160}
              priority
              className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
              alt="Ảnh đại diện"
            />
          </div>
        </div>
        
        <h2 className="mt-5 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {userName || "Người dùng"}
        </h2>
        <span className="mt-2 px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-md shadow-yellow-500/20">
          Thành viên
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="w-full mt-8 sm:mt-12 px-4 sm:px-8 pb-6 border-b border-slate-100">
        <div className="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar gap-2 sm:gap-4 scroll-smooth">
          {PROFILE_NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm sm:text-base whitespace-nowrap transition-all duration-300 ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-[#13ec5b] to-[#0fd34d] text-[#0d1b12] shadow-md shadow-[#13ec5b]/30 scale-[1.02]"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
              type="button"
            >
              <item.icon size={18} className={activeTab === item.id ? "scale-110" : ""} />
              {item.label}
            </button>
          ))}

          {/* Logout Button */}
          <button
            onClick={onLogout}
            disabled={isLogoutLoading}
            className="flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm sm:text-base whitespace-nowrap bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all ml-auto md:ml-0"
            type="button"
          >
            <LogOut size={18} />
            {isLogoutLoading ? "Đang xử lý..." : "Đăng xuất"}
          </button>
        </div>
      </div>
    </div>
  );
};

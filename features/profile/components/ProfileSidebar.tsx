// Component Sidebar hiển thị thông tin người dùng và navigation menu

"use client";

import React, { FC } from "react";
import Image from "next/image";
import { LogOut, Star } from "lucide-react";
import {
  PROFILE_NAV_ITEMS,
  ProfileTabType,
} from "@/features/profile/constants/profile.constants";

interface ProfileSidebarProps {
  userName: string | undefined;
  avatarUrl: string | undefined;
  activeTab: ProfileTabType;
  onTabChange: (tab: ProfileTabType) => void;
  onLogout: () => void;
  isLogoutLoading?: boolean;
}

export const ProfileSidebar: FC<ProfileSidebarProps> = ({
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
    <>
      {/* ══ MOBILE: Sticky tab bar ══ */}
      <div className="md:hidden sticky top-16 z-30 bg-white/85 backdrop-blur-md border-b border-white/40 shadow-sm">
        {/* User row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-50">
          <div className="size-9 rounded-full overflow-hidden border-2 border-[#13ec5b]/30 shrink-0">
            <Image
              src={avatarSrc}
              width={36}
              height={36}
              alt="Avatar"
              className="size-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-tight truncate max-w-[200px]">
              {userName || "Người dùng"}
            </p>
            <p className="text-[10px] font-black text-[#13ec5b] uppercase tracking-wide">Thành viên</p>
          </div>
        </div>

        {/* Tab pills */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
          {PROFILE_NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs whitespace-nowrap transition-all shrink-0 ${
                activeTab === item.id
                  ? "bg-[#13ec5b] text-[#0d1b12] shadow-md shadow-[#13ec5b]/20"
                  : "bg-slate-100 text-slate-500 hover:bg-[#f0fdf4] hover:text-[#13ec5b]"
              }`}
              type="button"
            >
              <item.icon size={12} />
              {item.label}
            </button>
          ))}
          <button
            onClick={onLogout}
            disabled={isLogoutLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs whitespace-nowrap bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all shrink-0 disabled:opacity-50"
            type="button"
          >
            <LogOut size={12} />
            {isLogoutLoading ? "..." : "Đăng xuất"}
          </button>
        </div>
      </div>

      {/* ══ DESKTOP: Vertical sidebar ══ */}
      <aside className="hidden md:flex w-64 lg:w-72 shrink-0 flex-col gap-6">
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-500 relative overflow-hidden">
          {/* Decorative glowing gradient */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#13ec5b]/10 to-transparent pointer-events-none" />
          
          {/* Avatar */}
          <div className="flex flex-col items-center text-center mb-8 relative z-10">
            <div className="relative group">
              <div className="size-28 rounded-full p-1 bg-gradient-to-tr from-[#13ec5b]/40 to-yellow-400/40 group-hover:from-[#13ec5b] group-hover:to-yellow-400 overflow-hidden shadow-xl transition-all duration-500 group-hover:scale-105">
                <div className="size-full rounded-full border-[3px] border-white overflow-hidden bg-white">
                  <Image
                    src={avatarSrc}
                    width={112}
                    height={112}
                    priority
                    className="size-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="Ảnh đại diện"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 size-8 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <Star size={14} fill="white" className="text-white" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-black text-base text-slate-900 uppercase tracking-tight line-clamp-2">
                {userName || "Người dùng"}
              </h3>
              <p className="text-[10px] font-black text-[#13ec5b] uppercase tracking-[0.2em] mt-1">
                Thành viên
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1.5">
            {PROFILE_NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 group ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-[#13ec5b] to-[#0fd34d] text-[#0d1b12] shadow-lg shadow-[#13ec5b]/30 scale-[1.02]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-[#13ec5b] hover:scale-[1.01]"
                }`}
                type="button"
              >
                <item.icon
                  size={18}
                  className={activeTab === item.id ? "" : "group-hover:scale-110 transition-transform duration-300"}
                />
                <span className="truncate">{item.label}</span>
              </button>
            ))}

            <div className="border-t border-slate-100 my-3" />

            <button
              onClick={onLogout}
              disabled={isLogoutLoading}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-rose-500 hover:bg-rose-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              <LogOut size={18} />
              {isLogoutLoading ? "Đang đăng xuất..." : "Đăng xuất"}
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
};

// Component Sidebar hiển thị thông tin người dùng và navigation menu

"use client";

import React, { FC } from "react";
import { ChevronRight, LogOut, Star } from "lucide-react";
import {
  PROFILE_NAV_ITEMS,
  ProfileTabType,
} from "@/features/profile/constants/profile.constants";

// Props của component
interface ProfileSidebarProps {
  // Tên người dùng
  userName: string | undefined;
  // Avatar URL
  avatarUrl: string | undefined;
  // Tab đang được chọn
  activeTab: ProfileTabType;
  // Callback khi click vào tab
  onTabChange: (tab: ProfileTabType) => void;
  // Callback khi click logout
  onLogout: () => void;
  // Trạng thái loading của logout
  isLogoutLoading?: boolean;
}

// Component chính
export const ProfileSidebar: FC<ProfileSidebarProps> = ({
  userName,
  avatarUrl,
  activeTab,
  onTabChange,
  onLogout,
  isLogoutLoading = false,
}) => {
  return (
    <aside className="w-full lg:w-80 flex flex-col gap-8">
      {/* Thông tin người dùng */}
      <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
        {/* Avatar section */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative group">
            <div className="size-24 rounded-full border-4 border-[#ee2b5b]/20 overflow-hidden shadow-2xl group-hover:border-[#ee2b5b] transition-all">
              <img
                src={
                  avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || "User")}&background=ee2b5b&color=fff`
                }
                className="size-full object-cover"
                alt="Ảnh đại diện người dùng"
              />
            </div>
            {/* Badge thành viênMy */}
            <div className="absolute -bottom-1 -right-1 size-8 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <Star size={14} fill="white" className="text-white" />
            </div>
          </div>

          {/* Tên người dùng */}
          <div className="mt-4">
            <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">
              {userName || "Người dùng"}
            </h3>
            <p className="text-[10px] font-black text-[#ee2b5b] uppercase tracking-[0.2em] mt-1">
              Thành viên
            </p>
          </div>
        </div>

        {/* Navigation menu */}
        <nav className="flex flex-col gap-2">
          {PROFILE_NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all group ${
                activeTab === item.id
                  ? "bg-[#ee2b5b] text-white shadow-xl shadow-[#ee2b5b]/20"
                  : "text-slate-500 hover:bg-[#ee2b5b]/5 hover:text-[#ee2b5b]"
              }`}
              type="button"
            >
              <item.icon
                size={20}
                className={
                  activeTab === item.id
                    ? "text-white"
                    : "group-hover:scale-110 transition-transform"
                }
              />
              <span>{item.label}</span>
              {activeTab === item.id && (
                <ChevronRight size={16} className="ml-auto" />
              )}
            </button>
          ))}

          {/* Divider */}
          <div className="border-t border-slate-100 my-4" />

          {/* Nút đăng xuất */}
          <button
            onClick={onLogout}
            disabled={isLogoutLoading}
            className="flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm text-rose-500 hover:bg-rose-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            <LogOut size={20} />
            {isLogoutLoading ? "Đang đăng xuất..." : "Đăng xuất"}
          </button>
        </nav>
      </div>
    </aside>
  );
};

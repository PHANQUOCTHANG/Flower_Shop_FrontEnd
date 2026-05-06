// Component Sidebar hiển thị navigation menu

"use client";

import React, { FC } from "react";
import { LogOut } from "lucide-react";
import {
  PROFILE_NAV_ITEMS,
  ProfileTabType,
} from "@/features/profile/constants/profile.constants";

interface ProfileSidebarProps {
  activeTab: ProfileTabType;
  onTabChange: (tab: ProfileTabType) => void;
  onLogout: () => void;
  isLogoutLoading?: boolean;
}

export const ProfileSidebar: FC<ProfileSidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
  isLogoutLoading = false,
}) => {
  return (
    <>
      {/* ══ MOBILE: Sticky tab bar ══ */}
      <div className="lg:hidden sticky top-16 z-30 bg-[#f8fafc]/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-3 px-4 -mx-4 sm:-mx-6 md:-mx-8 mb-6">
        {/* Tab pills */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth">
          {PROFILE_NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all shrink-0 ${
                activeTab === item.id
                  ? "bg-[#EE2B5B] text-white shadow-md shadow-[#EE2B5B]/30"
                  : "bg-white text-slate-500 border border-slate-200 hover:text-slate-900"
              }`}
              type="button"
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══ DESKTOP: Vertical sidebar ══ */}
      <aside className="hidden lg:flex w-[280px] shrink-0 flex-col pt-2 pb-10">
        <nav className="flex flex-col gap-2 relative">
          {/* Vertical line indicator container */}
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-slate-200" />
          
          {PROFILE_NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-4 px-6 py-4 font-semibold text-base transition-all duration-300 relative group w-full text-left rounded-r-2xl ${
                activeTab === item.id
                  ? "text-[#EE2B5B] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.03)]"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
              }`}
              type="button"
            >
              {/* Vertical active indicator */}
              {activeTab === item.id && (
                <div className="absolute left-[-1px] top-1 bottom-1 w-[3px] bg-[#EE2B5B] rounded-r-full shadow-[0_0_8px_rgba(238,43,91,0.4)] z-10" />
              )}
              
              <item.icon
                size={22}
                className={activeTab === item.id ? "" : "opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"}
              />
              <span className="truncate">{item.label}</span>
            </button>
          ))}

          <div className="my-8" />

          <button
            onClick={onLogout}
            disabled={isLogoutLoading}
            className="flex items-center gap-4 px-6 py-4 font-semibold text-base text-[#EE2B5B] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50/50 rounded-r-2xl w-full text-left"
            type="button"
          >
            <LogOut size={22} />
            {isLogoutLoading ? "Đang xử lý..." : "Đăng xuất"}
          </button>
        </nav>
      </aside>
    </>
  );
};

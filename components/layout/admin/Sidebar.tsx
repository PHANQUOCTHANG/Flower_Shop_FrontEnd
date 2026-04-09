/* eslint-disable @next/next/no-img-element */
"use client";

import React, { FC } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  Flower2,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { useLogout } from "@/features/auth/logout/hooks";
import { useAuthStore } from "@/stores/auth.store";

// --- Định nghĩa kiểu dữ liệu (Interfaces) ---
interface SidebarLinkProps {
  icon: React.ComponentType<any>;
  label: string;
  active?: boolean;
  badge?: string;
  onClick?: () => void;
}

interface SidebarProps {
  currentPath: string;
  onNavigate?: (path: string) => void;
}

// --- Component con: Nút điều hướng ---
const SidebarLink: FC<SidebarLinkProps> = ({
  icon: Icon,
  label,
  active,
  badge,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
      active
        ? "bg-[#13ec5b]/10 text-[#13ec5b] border border-[#13ec5b]/20 font-bold"
        : "text-slate-600 hover:bg-slate-50 font-medium"
    }`}
  >
    <Icon
      size={20}
      className={active ? "text-[#13ec5b]" : "group-hover:text-[#13ec5b]"}
    />
    <span className="text-sm">{label}</span>
    {badge && (
      <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
        {badge}
      </span>
    )}
  </button>
);

// --- Component chính: Sidebar ---
export const Sidebar: FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);

  const handleNavigate = (path: string) => {
    router.push(`/admin/${path}`);
    onNavigate?.(path);
  };

  // Hook logout
  const { logout, isLoading: isLogoutLoading } = useLogout("ADMIN");

  // Hàm đăng xuất
  const handleLogout = async () => {
    // setSuccessMessage("Đăng xuất thành công! Chuyển hướng...");
    await logout();
  };

  return (
    <aside className="w-72 shrink-0 border-r border-slate-200 bg-white flex flex-col h-full transition-colors duration-300">
      {/* Phần Logo thương hiệu */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="bg-[#13ec5b]/20 p-2.5 rounded-xl text-[#13ec5b]">
            <Flower2 size={28} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 text-xl font-black tracking-tight leading-none">
              BloomAdmin
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
              Hệ thống quản lý
            </p>
          </div>
        </div>
      </div>

      {/* Danh sách menu điều hướng chính */}
      <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto custom-scrollbar">
        <SidebarLink
          icon={LayoutDashboard}
          label="Tổng quan"
          active={currentPath === "dashboard"}
          onClick={() => handleNavigate("dashboard")}
        />
        <SidebarLink
          icon={Package}
          label="Sản phẩm"
          active={currentPath === "products"}
          onClick={() => handleNavigate("products")}
        />
        <SidebarLink
          icon={ShoppingBag}
          label="Đơn hàng"
          active={currentPath === "orders"}
          onClick={() => handleNavigate("orders")}
        //   badge="12"
        />
        <SidebarLink
          icon={MessageCircle}
          label="Tin nhắn"
          active={currentPath === "chat"}
          onClick={() => handleNavigate("chat")}
        />
        <SidebarLink
          icon={Users}
          label="Khách hàng"
          active={currentPath === "customers"}
          onClick={() => handleNavigate("customers")}
        />
        <SidebarLink
          icon={BarChart3}
          label="Báo cáo"
          active={currentPath === "reports"}
          onClick={() => handleNavigate("reports")}
        />

        {/* Đường kẻ phân cách */}
        <div className="pt-4 mt-4 border-t border-slate-100 ">
          <SidebarLink
            icon={Settings}
            label="Cài đặt"
            active={currentPath === "settings"}
            onClick={() => handleNavigate("settings")}
          />
          <SidebarLink icon={LogOut} label="Đăng xuất" onClick={handleLogout} />
        </div>
      </nav>

      {/* Thông tin tài khoản ở dưới cùng */}
      <div className="p-6 border-t border-slate-100 ">
        <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer group">
          <div className="relative">
            <img
              className="size-11 rounded-full object-cover border-2 border-[#13ec5b]/20 group-hover:border-[#13ec5b] transition-all"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
              alt="Admin Avatar"
            />
            <div className="absolute bottom-0 right-0 size-3 bg-[#13ec5b] border-2 border-white rounded-full"></div>
          </div>
          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-bold truncate text-slate-900 ">
              {user?.name}
            </p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
              Quản trị viên
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

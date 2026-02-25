"use client";

import React, { useState, useMemo } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  PlusCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Flower2,
  Bell,
  Eye,
  UserPlus,
  Star,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Trash2,
  Edit,
} from "lucide-react";

// --- DỮ LIỆU GIẢ LẬP KHÁCH HÀNG ---
const DANH_SACH_KHACH_HANG = [
  {
    id: "CUS-001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    phone: "0901 234 567",
    tier: "VIP",
    totalSpent: 12500000,
    lastOrder: "24/05/2024",
    status: "Đang hoạt động",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
  },
  {
    id: "CUS-002",
    name: "Trần Thị B",
    email: "tranthib@hotmail.com",
    phone: "0912 345 678",
    tier: "Vàng",
    totalSpent: 8200000,
    lastOrder: "22/05/2024",
    status: "Đang hoạt động",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
  {
    id: "CUS-003",
    name: "Lê Văn C",
    email: "levanc@yahoo.com",
    phone: "0987 654 321",
    tier: "Bạc",
    totalSpent: 1500000,
    lastOrder: "15/04/2024",
    status: "Ngừng hoạt động",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
  },
  {
    id: "CUS-004",
    name: "Phạm Minh D",
    email: "phamminhd@outlook.com",
    phone: "0905 556 667",
    tier: "VIP",
    totalSpent: 21000000,
    lastOrder: "24/05/2024",
    status: "Đang hoạt động",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
  {
    id: "CUS-005",
    name: "Hoàng Thị E",
    email: "hoangthie@gmail.com",
    phone: "0933 444 555",
    tier: "Đồng",
    totalSpent: 450000,
    lastOrder: "10/05/2024",
    status: "Đang hoạt động",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  },
];

// --- COMPONENT CON ---

const SidebarLink = ({
  icon: Icon,
  label,
  active = false,
  badge,
  onClick,
}: {
  icon: React.ComponentType<any>;
  label: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
      active
        ? "bg-[#13ec5b]/10 text-[#13ec5b] border border-[#13ec5b]/20 font-bold"
        : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 font-medium"
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

const TheThongKeMini = ({
  label,
  value,
  trend,
  isUp,
  icon: Icon,
  colorClass,
}: {
  label: string;
  value: string | number;
  trend?: string;
  isUp?: boolean;
  icon: React.ComponentType<any>;
  colorClass?: string;
}) => (
  <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex-1 min-w-[240px]">
    <div className="flex justify-between items-start mb-4">
      <div
        className={`p-2.5 rounded-xl ${colorClass || "bg-[#13ec5b]/10 text-[#13ec5b]"}`}
      >
        <Icon size={22} />
      </div>
      {trend && (
        <span
          className={`text-xs font-bold flex items-center gap-1 ${isUp ? "text-[#13ec5b]" : "text-red-500"}`}
        >
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {trend}
        </span>
      )}
    </div>
    <p className="text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
      {label}
    </p>
    <h3 className="text-slate-900 dark:text-white text-2xl font-black mt-1">
      {value}
    </h3>
  </div>
);

const TierBadge = ({ tier }) => {
  const styles = {
    VIP: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200",
    Vàng: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200",
    Bạc: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200",
    Đồng: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[tier] || styles["Đồng"]}`}
    >
      <Star size={10} fill="currentColor" />
      {tier}
    </span>
  );
};

// --- COMPONENT CHÍNH ---

export default function App() {
  const [tuKhoa, setTuKhoa] = useState("");
  const [locHạng, setLocHang] = useState("Tất cả");

  const khachHangLoc = useMemo(() => {
    return DANH_SACH_KHACH_HANG.filter((cus) => {
      const matchSearch =
        cus.name.toLowerCase().includes(tuKhoa.toLowerCase()) ||
        cus.phone.includes(tuKhoa) ||
        cus.email.toLowerCase().includes(tuKhoa.toLowerCase());
      const matchTier = locHạng === "Tất cả" || cus.tier === locHạng;
      return matchSearch && matchTier;
    });
  }, [tuKhoa, locHạng]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f8f6] dark:bg-[#102216] font-['Inter',_sans-serif] text-slate-900 dark:text-slate-100">
      {/* Sidebar - Đồng bộ 100% */}
      <aside className="hidden lg:flex w-72 flex-shrink-0 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex-col h-full">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="bg-[#13ec5b]/20 p-2.5 rounded-xl">
              <Flower2 className="text-[#13ec5b]" size={28} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-xl font-black leading-none tracking-tight">
                BloomAdmin
              </h1>
              <p className="text-slate-500 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                Hệ thống quản lý
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          <SidebarLink icon={LayoutDashboard} label="Tổng quan" />
          <SidebarLink icon={Package} label="Sản phẩm" />
          <SidebarLink icon={ShoppingBag} label="Đơn hàng" badge="12" />
          <SidebarLink icon={Users} label="Khách hàng" active />
          <SidebarLink icon={BarChart3} label="Báo cáo" />
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-zinc-800">
            <SidebarLink icon={Settings} label="Cài đặt" />
          </div>
        </nav>

        <div className="p-6 border-t border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-2xl transition-all cursor-pointer group">
            <img
              className="size-11 rounded-full object-cover border-2 border-[#13ec5b]/20 group-hover:border-[#13ec5b] transition-all"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
              alt="Alex Rivera"
            />
            <div className="flex flex-col overflow-hidden">
              <p className="text-sm font-bold truncate">Alex Rivera</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                Quản trị viên
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Nội dung chính */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header - Đồng bộ 100% */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl px-8 py-5">
          <div className="flex items-center gap-8">
            <h2 className="text-slate-900 dark:text-white text-2xl font-black tracking-tight uppercase">
              Quản lý khách hàng
            </h2>
            <div className="relative hidden md:block w-80">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                value={tuKhoa}
                onChange={(e) => setTuKhoa(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border-none rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-500 text-sm font-medium focus:ring-2 focus:ring-[#13ec5b] transition-all shadow-inner"
                placeholder="Tìm tên, SĐT, email..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[#13ec5b] text-[#102216] px-6 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-[#13ec5b]/30 hover:scale-105 active:scale-95 transition-all">
              <UserPlus size={18} />
              <span>Thêm khách hàng</span>
            </button>
          </div>
        </header>

        <div className="p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8 animate-in fade-in duration-500">
          {/* Thẻ thống kê */}
          <div className="flex flex-wrap gap-6">
            <TheThongKeMini
              label="Tổng khách hàng"
              value="1,284"
              icon={Users}
            />
            <TheThongKeMini
              label="Khách hàng mới"
              value="+42"
              icon={UserPlus}
              colorClass="bg-blue-500/10 text-blue-500"
            />
            <TheThongKeMini
              label="Thành viên VIP"
              value="86"
              icon={Star}
              colorClass="bg-purple-500/10 text-purple-500"
            />
            <TheThongKeMini
              label="Đang hoạt động"
              value="1,120"
              icon={UserCheck}
              colorClass="bg-[#13ec5b]/10 text-[#13ec5b]"
            />
          </div>

          {/* Bộ lọc & Công cụ */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {["Tất cả", "VIP", "Vàng", "Bạc", "Đồng"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setLocHang(tier)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all border ${
                    locHạng === tier
                      ? "bg-[#13ec5b] text-[#102216] border-[#13ec5b]"
                      : "bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-500"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
                <Filter size={16} />
                <span>Sắp xếp: Chi tiêu giảm dần</span>
              </div>
            </div>
          </div>

          {/* Bảng khách hàng */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden mb-10">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-800/30 border-b border-slate-200 dark:border-zinc-800">
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                      Khách hàng
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                      Liên hệ
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                      Hạng thẻ
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                      Tổng chi tiêu
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                      Lần cuối
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {khachHangLoc.map((cus) => (
                    <tr
                      key={cus.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={cus.avatar}
                            className="size-10 rounded-full object-cover border-2 border-slate-100 dark:border-zinc-700"
                            alt={cus.name}
                          />
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              {cus.name}
                            </p>
                            <p className="text-[10px] font-black text-slate-400 uppercase">
                              {cus.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400">
                            <Mail size={12} className="text-slate-400" />
                            {cus.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400">
                            <Phone size={12} className="text-slate-400" />
                            {cus.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <TierBadge tier={cus.tier} />
                      </td>
                      <td className="px-6 py-5 text-right text-sm font-black text-[#13ec5b]">
                        {cus.totalSpent.toLocaleString("vi-VN")}₫
                      </td>
                      <td className="px-6 py-5 text-center text-xs font-bold text-slate-500">
                        {cus.lastOrder}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                            cus.status === "Đang hoạt động"
                              ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-500"
                              : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-500"
                          }`}
                        >
                          <div
                            className={`size-1.5 rounded-full ${cus.status === "Đang hoạt động" ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                          {cus.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/10 rounded-xl transition-all">
                            <Eye size={18} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
                            <Edit size={18} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            <div className="bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-200 dark:border-zinc-800 px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm font-bold text-slate-500 dark:text-zinc-500">
                Hiển thị {khachHangLoc.length} trên 1,284 khách hàng
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-400 disabled:opacity-30"
                  disabled
                >
                  <ChevronLeft size={18} />
                </button>
                <button className="size-9 flex items-center justify-center rounded-xl bg-[#13ec5b] text-[#102216] font-black text-xs shadow-md">
                  1
                </button>
                <button className="size-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-500 hover:bg-slate-50 text-xs font-bold">
                  2
                </button>
                <button className="size-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-500 hover:bg-slate-50 text-xs font-bold">
                  3
                </button>
                <button className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-500 hover:bg-slate-50 transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

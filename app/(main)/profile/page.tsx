"use client";

import React, { useState, FC } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  ChevronRight,
  Package,
  MapPin,
  LogOut,
  Star,
  Edit3,
  Plus,
  Home,
  Briefcase,
  ShieldCheck,
  UserCircle,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import Alert from "@/components/ui/Alert";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/features/auth/logout/hooks";

// --- Interfaces ---
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  gender: string;
  tier: string;
  avatar: string;
}

interface Order {
  id: string;
  date: string;
  status: "processing" | "shipping" | "completed";
  total: number;
}

interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  street: string;
  isDefault?: boolean;
}

// --- Mock Data (Dữ liệu giả lập) ---
const USER_DATA: UserProfile = {
  name: "Nguyễn Lan Anh",
  email: "lananh.nguyen@example.com",
  phone: "090 123 4567",
  gender: "Nữ",
  tier: "Thành viên Vàng",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
};

const RECENT_ORDERS: Order[] = [
  { id: "#FLW-9821", date: "12/05/2024", status: "processing", total: 1250000 },
  { id: "#FLW-9750", date: "08/05/2024", status: "shipping", total: 890000 },
  { id: "#FLW-9602", date: "01/05/2024", status: "completed", total: 2100000 },
];

const ADDRESS_BOOK: Address[] = [
  {
    id: "1",
    label: "Nhà riêng",
    name: "Nguyễn Lan Anh",
    phone: "090 123 4567",
    street: "123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. HCM",
    isDefault: true,
  },
  {
    id: "2",
    label: "Công ty",
    name: "Nguyễn Lan Anh",
    phone: "090 123 4567",
    street: "Tầng 15, Bitexco Financial Tower, Quận 1, TP. HCM",
  },
];

// --- Component con: Badge Trạng thái đơn hàng ---
const StatusBadge: FC<{ status: Order["status"] }> = ({ status }) => {
  const styles = {
    processing:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    shipping:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    completed:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };
  const labels = {
    processing: "Đang xử lý",
    shipping: "Đang giao",
    completed: "Hoàn thành",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
};

export default function UserAccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [successMessage, setSuccessMessage] = useState("");

  // Hook logout
  const { logout, isLoading: isLogoutLoading } = useLogout();

  // Hàm đăng xuất
  const handleLogout = async () => {
    setSuccessMessage("Đăng xuất thành công! Chuyển hướng...");
    await logout();
  };

  return (
    <div className="min-h-screen bg-[#fcf8f9] dark:bg-[#1a0c10] font-['Inter',_sans-serif] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Thông báo fixed */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm">
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage("")}
            autoClose={false}
          />
        </div>
      )}
      <main className="mx-auto w-full max-w-[1300px] px-6 md:px-12 py-10 animate-in fade-in duration-700">
        <Breadcrumbs
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Tài khoản của tôi" },
          ]}
        />

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cột trái: Sidebar & Tóm tắt Profile */}
          <aside className="w-full lg:w-80 flex flex-col gap-8">
            <div className="bg-white dark:bg-[#1a0c10] rounded-[2rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="relative group">
                  <div className="size-24 rounded-full border-4 border-[#ee2b5b]/20 overflow-hidden shadow-2xl group-hover:border-[#ee2b5b] transition-all">
                    <img
                      src={USER_DATA.avatar}
                      className="size-full object-cover"
                      alt="Profile"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 size-8 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-white dark:border-[#1a0c10] shadow-lg">
                    <Star size={14} fill="white" className="text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight">
                    {USER_DATA.name}
                  </h3>
                  <p className="text-[10px] font-black text-[#ee2b5b] uppercase tracking-[0.2em] mt-1">
                    {USER_DATA.tier}
                  </p>
                </div>
              </div>

              {/* Menu điều hướng nội bộ */}
              <nav className="flex flex-col gap-2">
                {[
                  { id: "profile", label: "Thông tin cá nhân", icon: User },
                  { id: "orders", label: "Đơn hàng của tôi", icon: Package },
                  { id: "address", label: "Sổ địa chỉ", icon: MapPin },
                  { id: "password", label: "Đổi mật khẩu", icon: ShieldCheck },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all group ${
                      activeTab === item.id
                        ? "bg-[#ee2b5b] text-white shadow-xl shadow-[#ee2b5b]/20"
                        : "text-slate-500 hover:bg-[#ee2b5b]/5 hover:text-[#ee2b5b]"
                    }`}
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
                <div className="h-px bg-slate-100 dark:bg-white/5 my-4" />
                <button
                  onClick={handleLogout}
                  disabled={isLogoutLoading}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut size={20} />
                  <span>
                    {isLogoutLoading ? "Đang đăng xuất..." : "Đăng xuất"}
                  </span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Cột phải: Nội dung chi tiết thay đổi theo Tab được chọn */}
          <div className="flex-1 space-y-8">
            {/* TAB: THÔNG TIN CÁ NHÂN */}
            {activeTab === "profile" && (
              <section className="bg-white dark:bg-[#1a0c10] rounded-[2.5rem] p-10 border border-slate-100 dark:border-white/5 shadow-sm animate-in slide-in-from-right-10 duration-500">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Hồ sơ cá nhân
                  </h2>
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-[#ee2b5b]/10 text-[#ee2b5b] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#ee2b5b] hover:text-white transition-all">
                    <Edit3 size={14} /> Chỉnh sửa
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                  {[
                    { label: "Họ và tên", value: USER_DATA.name },
                    { label: "Email liên hệ", value: USER_DATA.email },
                    { label: "Số điện thoại", value: USER_DATA.phone },
                    { label: "Giới tính", value: USER_DATA.gender },
                  ].map((field, i) => (
                    <div key={i} className="space-y-2 group">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        {field.label}
                      </p>
                      <p className="text-base font-bold text-slate-800 dark:text-white group-hover:text-[#ee2b5b] transition-colors">
                        {field.value}
                      </p>
                      <div className="h-0.5 w-12 bg-slate-100 dark:bg-white/5 group-hover:w-full group-hover:bg-[#ee2b5b]/20 transition-all duration-500" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* TAB: ĐƠN HÀNG */}
            {activeTab === "orders" && (
              <section className="bg-white dark:bg-[#1a0c10] rounded-[2.5rem] p-10 border border-slate-100 dark:border-white/5 shadow-sm animate-in slide-in-from-right-10 duration-500">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">
                    Đơn hàng của bạn
                  </h2>
                  <button className="text-[#ee2b5b] text-xs font-black uppercase tracking-widest hover:underline">
                    Tải lịch sử
                  </button>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-slate-100 dark:border-white/5">
                        <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Mã đơn hàng
                        </th>
                        <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Ngày đặt
                        </th>
                        <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Trạng thái
                        </th>
                        <th className="pb-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                      {RECENT_ORDERS.map((order) => (
                        <tr
                          key={order.id}
                          className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                        >
                          <td className="py-6 text-sm font-black text-[#ee2b5b]">
                            {order.id}
                          </td>
                          <td className="py-6 text-sm font-bold text-slate-500">
                            {order.date}
                          </td>
                          <td className="py-6">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="py-6 text-right text-sm font-black text-slate-900 dark:text-white">
                            {order.total.toLocaleString("vi-VN")}₫
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* TAB: SỔ ĐỊA CHỈ */}
            {activeTab === "address" && (
              <section className="bg-white dark:bg-[#1a0c10] rounded-[2.5rem] p-10 border border-slate-100 dark:border-white/5 shadow-sm animate-in slide-in-from-right-10 duration-500">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Sổ địa chỉ
                  </h2>
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-[#ee2b5b] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#ee2b5b]/20 hover:scale-105 transition-all">
                    <Plus size={16} /> Thêm địa chỉ
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ADDRESS_BOOK.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-6 rounded-[2rem] border-2 transition-all relative group ${addr.isDefault ? "border-[#ee2b5b] bg-[#ee2b5b]/5 shadow-lg shadow-[#ee2b5b]/5" : "border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-transparent hover:border-[#ee2b5b]/30"}`}
                    >
                      {addr.isDefault && (
                        <span className="absolute top-6 right-6 px-2 py-0.5 rounded-lg text-[9px] font-black bg-[#ee2b5b] text-white uppercase tracking-widest">
                          Mặc định
                        </span>
                      )}
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`p-2 rounded-xl ${addr.isDefault ? "bg-[#ee2b5b] text-white" : "bg-slate-200 dark:bg-zinc-800 text-slate-400 group-hover:text-[#ee2b5b] transition-colors"}`}
                        >
                          {addr.label === "Nhà riêng" ? (
                            <Home size={18} />
                          ) : (
                            <Briefcase size={18} />
                          )}
                        </div>
                        <span className="font-black text-sm uppercase tracking-tight">
                          {addr.label}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                        {addr.name}
                      </p>
                      <p className="text-xs font-medium text-slate-500 mb-3">
                        {addr.phone}
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium line-clamp-2">
                        {addr.street}
                      </p>
                      <div className="mt-6 flex gap-4 border-t border-slate-100 dark:border-white/5 pt-4">
                        <button className="text-[10px] font-black uppercase text-[#ee2b5b] hover:underline">
                          Chỉnh sửa
                        </button>
                        <button className="text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 transition-colors">
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Placeholder cho tab Mật khẩu */}
            {activeTab === "password" && (
              <section className="bg-white dark:bg-[#1a0c10] rounded-[2.5rem] p-10 border border-slate-100 dark:border-white/5 shadow-sm animate-in slide-in-from-right-10 duration-500 text-center">
                <div className="size-20 bg-slate-50 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-[#ee2b5b]">
                  <ShieldCheck size={40} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  Đổi mật khẩu
                </h2>
                <p className="text-slate-500 mt-2 font-medium">
                  Tính năng đang được cập nhật giao diện chi tiết...
                </p>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

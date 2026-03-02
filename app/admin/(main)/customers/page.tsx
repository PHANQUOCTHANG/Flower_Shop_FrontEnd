"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  PlusCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Bell,
  Eye,
  Mail,
  Phone,
  Trash2,
  Edit,
  Star,
} from "lucide-react";

// Dữ liệu khách hàng
const CUSTOMERS = [
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

// Badge hạng thể
const TierBadge = ({ tier }: { tier: string }) => {
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

// Component chính
export default function CustomersPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTier, setSelectedTier] = useState("Tất cả");

  // Lọc khách hàng theo tìm kiếm và hạng
  const filteredCustomers = useMemo(() => {
    return CUSTOMERS.filter((customer) => {
      const matchSearch =
        customer.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        customer.phone.includes(searchKeyword) ||
        customer.email.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchTier =
        selectedTier === "Tất cả" || customer.tier === selectedTier;
      return matchSearch && matchTier;
    });
  }, [searchKeyword, selectedTier]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#f6f8f6] dark:bg-[#102216] font-['Inter',_sans-serif] text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl px-8 py-5">
        <h1 className="text-slate-900 dark:text-white text-2xl font-black tracking-tight uppercase">
          Quản lý khách hàng
        </h1>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#13ec5b] text-[#102216] px-6 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-[#13ec5b]/30 hover:scale-105 active:scale-95 transition-all">
            <PlusCircle size={18} />
            <span>Thêm khách hàng</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8 animate-in fade-in duration-500">
          {/* Stat cards */}
          <div className="flex flex-wrap gap-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex-1 min-w-[240px]">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-[#13ec5b]/10 text-[#13ec5b]">
                  <Users size={22} />
                </div>
              </div>
              <p className="text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
                Tổng khách hàng
              </p>
              <h3 className="text-slate-900 dark:text-white text-2xl font-black mt-1">
                1,284
              </h3>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex-1 min-w-[240px]">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                  <Users size={22} />
                </div>
              </div>
              <p className="text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
                Khách hàng mới
              </p>
              <h3 className="text-slate-900 dark:text-white text-2xl font-black mt-1">
                +42
              </h3>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex-1 min-w-[240px]">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
                  <Star size={22} />
                </div>
              </div>
              <p className="text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
                Thành viên VIP
              </p>
              <h3 className="text-slate-900 dark:text-white text-2xl font-black mt-1">
                86
              </h3>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex-1 min-w-[240px]">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-[#13ec5b]/10 text-[#13ec5b]">
                  <Users size={22} />
                </div>
              </div>
              <p className="text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
                Đang hoạt động
              </p>
              <h3 className="text-slate-900 dark:text-white text-2xl font-black mt-1">
                1,120
              </h3>
            </div>
          </div>

          {/* Filter section */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {["Tất cả", "VIP", "Vàng", "Bạc", "Đồng"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedTier === tier
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

          {/* Search bar */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-none rounded-xl bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder:text-slate-500 text-sm font-medium focus:ring-2 focus:ring-[#13ec5b] transition-all shadow-sm"
              placeholder="Tìm tên, SĐT, email..."
              type="text"
            />
          </div>

          {/* Customer table */}
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
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={customer.avatar}
                            className="size-10 rounded-full object-cover border-2 border-slate-100 dark:border-zinc-700"
                            alt={customer.name}
                          />
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              {customer.name}
                            </p>
                            <p className="text-[10px] font-black text-slate-400 uppercase">
                              {customer.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400">
                            <Mail size={12} className="text-slate-400" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400">
                            <Phone size={12} className="text-slate-400" />
                            {customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <TierBadge tier={customer.tier} />
                      </td>
                      <td className="px-6 py-5 text-right text-sm font-black text-[#13ec5b]">
                        {customer.totalSpent.toLocaleString("vi-VN")}₫
                      </td>
                      <td className="px-6 py-5 text-center text-xs font-bold text-slate-500">
                        {customer.lastOrder}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                            customer.status === "Đang hoạt động"
                              ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-500"
                              : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-500"
                          }`}
                        >
                          <div
                            className={`size-1.5 rounded-full ${customer.status === "Đang hoạt động" ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                          {customer.status}
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

            {/* Pagination */}
            <div className="bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-200 dark:border-zinc-800 px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm font-bold text-slate-500 dark:text-zinc-500">
                Hiển thị {filteredCustomers.length} trên 1,284 khách hàng
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

"use client";

import React, { useState, useMemo } from "react";
import {
  PlusCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Bell,
  Eye,
  Download,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// Dữ liệu đơn hàng
const ORDERS = [
  {
    id: "#ORD-1024",
    date: "24/05/2024",
    customer: "Nguyễn Văn A",
    phone: "0901234567",
    total: 1200000,
    payment: "Đã thanh toán",
    delivery: "Chờ xử lý",
  },
  {
    id: "#ORD-1025",
    date: "24/05/2024",
    customer: "Trần Thị B",
    phone: "0912345678",
    total: 850000,
    payment: "Chưa thanh toán",
    delivery: "Đang giao",
  },
  {
    id: "#ORD-1026",
    date: "23/05/2024",
    customer: "Lê Văn C",
    phone: "0987654321",
    total: 2100000,
    payment: "Đã thanh toán",
    delivery: "Đã giao",
  },
  {
    id: "#ORD-1027",
    date: "23/05/2024",
    customer: "Phạm Thị D",
    phone: "0905556667",
    total: 450000,
    payment: "Đã thanh toán",
    delivery: "Đã hủy",
  },
  {
    id: "#ORD-1028",
    date: "22/05/2024",
    customer: "Hoàng Văn E",
    phone: "0933444555",
    total: 1550000,
    payment: "Chưa thanh toán",
    delivery: "Chờ xử lý",
  },
];

// Badge trạng thái
const StatusBadge = ({ label }: { label: string }) => {
  const styles = {
    "Đã thanh toán":
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "Chưa thanh toán":
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    "Chờ xử lý":
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    "Đang giao":
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "Đã giao": "bg-[#13ec5b]/10 text-green-700 dark:text-[#13ec5b]",
    "Đã hủy":
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${styles[label] || styles["Đã hủy"]}`}
    >
      {label}
    </span>
  );
};

// Component chính
export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [searchKeyword, setSearchKeyword] = useState("");

  const tabs = [
    { name: "Tất cả", count: 128 },
    { name: "Chờ xử lý", count: 12 },
    { name: "Đang giao", count: 45 },
    { name: "Đã giao", count: 68 },
    { name: "Đã hủy", count: 3 },
  ];

  // Lọc đơn hàng theo tìm kiếm và tab
  const filteredOrders = useMemo(() => {
    return ORDERS.filter((order) => {
      const matchSearch =
        order.id.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchTab = activeTab === "Tất cả" || order.delivery === activeTab;
      return matchSearch && matchTab;
    });
  }, [searchKeyword, activeTab]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#f6f8f6] dark:bg-[#102216] font-['Inter',_sans-serif]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl px-8 py-5">
        <div className="flex items-center justify-between max-w-[1440px] mx-auto">
          <h1 className="text-slate-900 dark:text-white text-2xl font-black uppercase tracking-tight">
            Quản lý đơn hàng
          </h1>
          <div className="flex items-center gap-3">
            {/* Nút xuất báo cáo */}
            <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold shadow-sm hover:bg-slate-50 transition-all">
              <Download size={16} />
              <span>Xuất báo cáo</span>
            </button>
            {/* Nút thông báo */}
            <button className="relative p-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-red-500"></span>
            </button>
            {/* Nút tạo đơn mới */}
            <button className="flex items-center gap-2 bg-[#13ec5b] text-[#102216] px-6 py-3 rounded-xl text-sm font-black shadow-lg shadow-[#13ec5b]/30 hover:scale-105 active:scale-95 transition-all">
              <PlusCircle size={20} />
              <span>Tạo đơn mới</span>
            </button>
          </div>
        </div>
      </header>

      {/* Nội dung */}
      <main className="p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8 animate-in fade-in duration-500">
        {/* Tab điều hướng */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-100 dark:border-zinc-800 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-2 px-8 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.name
                    ? "border-[#13ec5b] text-[#13ec5b] bg-[#13ec5b]/5"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.name}
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    activeTab === tab.name
                      ? "bg-[#13ec5b] text-[#102216]"
                      : "bg-slate-100 text-slate-500 dark:bg-zinc-800"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Thanh tìm kiếm */}
          <div className="p-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-[#13ec5b]/50"
                placeholder="Lọc nhanh..."
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all">
              <Filter size={16} />
              <span>Bộ lọc</span>
            </button>
          </div>
        </div>

        {/* Bảng đơn hàng */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-800/30 border-b border-slate-200 dark:border-zinc-800">
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Mã đơn
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Ngày đặt
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Khách hàng
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Số điện thoại
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                    Thanh toán
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                    Giao hàng
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors group"
                  >
                    <td className="px-6 py-5 text-sm font-black text-[#13ec5b]">
                      {order.id}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                      {order.date}
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-900 dark:text-white">
                      {order.customer}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                      {order.phone}
                    </td>
                    <td className="px-6 py-5 text-sm font-black text-slate-900 dark:text-white text-right">
                      ₫{order.total.toLocaleString("vi-VN")}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <StatusBadge label={order.payment} />
                    </td>
                    <td className="px-6 py-5 text-center">
                      <StatusBadge label={order.delivery} />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.delivery === "Chờ xử lý" && (
                          <button className="bg-[#13ec5b] text-[#102216] text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100">
                            Giao hàng
                          </button>
                        )}
                        {order.delivery === "Đang giao" && (
                          <button className="bg-blue-500 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100">
                            Hoàn tất
                          </button>
                        )}
                        <button className="p-2 text-slate-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/10 rounded-xl transition-all">
                          <Eye size={18} />
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
              Hiển thị {filteredOrders.length} của 128 đơn hàng
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
              <button className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-500 hover:bg-slate-50">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Thẻ thống kê */}
        <div className="flex flex-wrap gap-6 mb-10">
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex-1 min-w-[200px]">
            <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">
                Đang chờ
              </p>
              <p className="text-xl font-black">12 Đơn</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex-1 min-w-[200px]">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
              <Truck size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">
                Đang giao
              </p>
              <p className="text-xl font-black">45 Đơn</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex-1 min-w-[200px]">
            <div className="bg-[#13ec5b]/20 text-green-600 p-2 rounded-xl">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">
                Hoàn tất
              </p>
              <p className="text-xl font-black">68 Đơn</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex-1 min-w-[200px]">
            <div className="bg-red-100 text-red-600 p-2 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">
                Đã hủy
              </p>
              <p className="text-xl font-black">3 Đơn</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

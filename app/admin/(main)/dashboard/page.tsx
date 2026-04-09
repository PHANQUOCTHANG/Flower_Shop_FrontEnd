"use client";

import React from "react";
import {
  Bell,
  TrendingUp,
  TrendingDown,
  CreditCard,
  UserPlus,
  Clock,
  Eye,
  ShoppingBag,
} from "lucide-react";

// Dữ liệu đơn hàng gần đây
const RECENT_ORDERS = [
  {
    id: "#DH-1024",
    customer: "Nguyễn Văn A",
    total: 850000,
    status: "Đã thanh toán",
    date: "2023-10-24",
  },
  {
    id: "#DH-1023",
    customer: "Lê Thị B",
    total: 1200000,
    status: "Đang xử lý",
    date: "2023-10-24",
  },
  {
    id: "#DH-1022",
    customer: "Trần Văn C",
    total: 450000,
    status: "Đã gửi",
    date: "2023-10-23",
  },
  {
    id: "#DH-1021",
    customer: "Phạm Minh D",
    total: 950000,
    status: "Đã thanh toán",
    date: "2023-10-23",
  },
  {
    id: "#DH-1020",
    customer: "Hoàng Thị E",
    total: 600000,
    status: "Đã gửi",
    date: "2023-10-22",
  },
];

// Thẻ thống kê hiển thị chỉ số
const StatCard = ({
  label,
  value,
  trend,
  isUp,
  icon: Icon,
  colorClass,
}: {
  label: string;
  value: string;
  trend: string;
  isUp: boolean;
  icon: any;
  colorClass?: string;
}) => (
  <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div
        className={`p-2 sm:p-2.5 rounded-xl ${colorClass || "bg-[#13ec5b]/10 text-[#13ec5b]"}`}
      >
        <Icon size={20} />
      </div>
      <span
        className={`text-xs font-bold flex items-center gap-1 ${isUp ? "text-[#13ec5b]" : "text-amber-500"}`}
      >
        {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {trend}
      </span>
    </div>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
      {label}
    </p>
    <h3 className="text-slate-900 text-lg sm:text-2xl font-black mt-1">
      {value}
    </h3>
  </div>
);

// Trang Dashboard
const DashboardView = () => {
  // Dữ liệu biểu đồ cột theo ngày
  const chartData = [
    { label: "Thứ 2", height: "32%" },
    { label: "Thứ 3", height: "65%" },
    { label: "Thứ 4", height: "45%" },
    { label: "Thứ 5", height: "90%" },
    { label: "Thứ 6", height: "75%" },
    { label: "Thứ 7", height: "100%" },
    { label: "CN", height: "25%" },
  ];

  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-in fade-in duration-500">
      {/* 4 thẻ thống kê chính */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          label="Tổng doanh thu"
          value="₫12.450.000"
          trend="+12.5%"
          isUp
          icon={CreditCard}
          colorClass="bg-[#13ec5b]/10 text-[#13ec5b]"
        />
        <StatCard
          label="Tổng đơn hàng"
          value="342"
          trend="+8.2%"
          isUp
          icon={ShoppingBag}
          colorClass="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          label="Khách hàng mới"
          value="56"
          trend="+4.1%"
          isUp
          icon={UserPlus}
          colorClass="bg-purple-500/10 text-purple-500"
        />
        <StatCard
          label="Đơn chờ xử lý"
          value="12"
          trend="-2.4%"
          isUp={false}
          icon={Clock}
          colorClass="bg-amber-500/10 text-amber-500"
        />
      </div>

      {/* Biểu đồ doanh thu và danh mục phổ biến */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Biểu đồ cột doanh thu theo thời gian */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
            <h2 className="text-slate-900 text-lg font-bold">
              Doanh thu theo thời gian
            </h2>
            <select className="bg-slate-50 border-none rounded-lg text-xs font-bold text-slate-500 focus:ring-0 cursor-pointer py-2 px-4 w-full sm:w-auto">
              <option>7 ngày gần đây</option>
              <option>30 ngày gần đây</option>
            </select>
          </div>
          {/* Các cột biểu đồ */}
          <div className="h-40 sm:h-48 lg:h-64 flex items-end justify-between gap-2 sm:gap-3 px-1 sm:px-2">
            {chartData.map((item, idx) => (
              <div
                key={idx}
                className="w-full bg-slate-50 h-full rounded-t-xl relative group flex items-end"
              >
                <div
                  className="w-full bg-[#13ec5b]/20 rounded-t-lg border-t-2 border-[#13ec5b] transition-all duration-1000 ease-out"
                  style={{ height: item.height }}
                ></div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 group-hover:text-[#13ec5b]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Danh mục phổ biến */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-slate-900 text-lg font-bold mb-6">
            Danh mục phổ biến
          </h2>
          <div className="flex flex-col items-center">
            {/* Vòng tròn tiến trình */}
            <div className="relative size-32 sm:size-40 lg:size-44 rounded-full border-[12px] sm:border-[16px] lg:border-[18px] border-slate-100 flex items-center justify-center mb-6 sm:mb-8">
              <div className="absolute inset-0 rounded-full border-[18px] border-t-[#13ec5b] border-r-[#13ec5b]/60 border-transparent rotate-45"></div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-black text-slate-900">
                  85%
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                  Tăng trưởng
                </p>
              </div>
            </div>
            {/* Chi tiết danh mục */}
            <div className="w-full space-y-4">
              {[
                { label: "Sinh nhật", val: "45%", color: "bg-[#13ec5b]" },
                { label: "Cưới", val: "30%", color: "bg-blue-500" },
                { label: "Kỷ niệm", val: "25%", color: "bg-purple-500" },
              ].map((cat) => (
                <div
                  key={cat.label}
                  className="flex items-center justify-between text-xs font-bold"
                >
                  <div className="flex items-center gap-2">
                    <div className={`size-2.5 rounded-full ${cat.color}`}></div>
                    <span className="text-slate-600 ">{cat.label}</span>
                  </div>
                  <span className="text-slate-900 ">{cat.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bảng đơn hàng gần đây */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-auto mb-8">
        <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-slate-900 text-base sm:text-lg font-bold">
            Đơn hàng gần đây
          </h2>
          <button className="text-[#13ec5b] text-sm font-bold hover:underline">
            Xem tất cả
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left">
                  Mã đơn
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left hidden sm:table-cell">
                  Khách hàng
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left">
                  Tổng tiền
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left">
                  Trạng thái
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {RECENT_ORDERS.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-slate-900">
                    {order.id}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-600 font-medium hidden sm:table-cell">
                    {order.customer}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-slate-900">
                    ₫{order.total.toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span
                      className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        order.status === "Đã thanh toán"
                          ? "bg-[#13ec5b]/20 text-green-700"
                          : order.status === "Đang xử lý"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                    <button className="p-2 text-[#13ec5b] hover:bg-[#13ec5b]/10 rounded-lg transition-colors">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Component chính - Dashboard
export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-auto bg-[#f6f8f6] font-['Inter',_sans-serif]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl px-4 sm:px-6 md:px-8 py-4 sm:py-5">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <h1 className="text-slate-900 text-xl sm:text-2xl font-black uppercase tracking-tight">
            Tổng quan
          </h1>
          <div className="flex items-center gap-4">
            {/* Biểu tượng thông báo */}
            <button className="relative p-3 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-red-500"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Nội dung */}
      <main className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto w-full overflow-y-auto">
        <DashboardView />
      </main>
    </div>
  );
}

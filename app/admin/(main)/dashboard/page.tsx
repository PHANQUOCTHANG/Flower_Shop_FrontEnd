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
  Edit,
  Trash2,
  Flower2,
  Bell,
  TrendingUp,
  TrendingDown,
  CreditCard,
  UserPlus,
  Clock,
  Eye,
} from "lucide-react";

// --- MOCK DATA ---

// Dữ liệu sản phẩm mẫu cho hiển thị trong dashboard
const PRODUCT_DATA = [
  {
    id: "FLW-001",
    name: "Red Rose Premium Bouquet",
    category: "Birthday",
    price: 550000,
    stock: 12,
    status: "In Stock",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bbaa?w=400&q=80",
  },
  {
    id: "FLW-042",
    name: "Grand Opening Arrangement",
    category: "Opening",
    price: 1200000,
    stock: 5,
    status: "In Stock",
    image:
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400&q=80",
  },
  {
    id: "FLW-009",
    name: "White Chrysanthemum Condolence",
    category: "Funeral",
    price: 300000,
    stock: 0,
    status: "Out of Stock",
    image:
      "https://images.unsplash.com/photo-1563240381-5ccf7690ca08?w=400&q=80",
  },
  {
    id: "FLW-015",
    name: "Bright Sunflower Bouquet",
    category: "Anniversary",
    price: 450000,
    stock: 18,
    status: "In Stock",
    image:
      "https://images.unsplash.com/photo-1595853035070-59a39fe84de3?w=400&q=80",
  },
];

// Dữ liệu đơn hàng gần đây
const RECENT_ORDERS = [
  {
    id: "#DH-1024",
    customer: "Nguyen Van A",
    total: 850000,
    status: "Paid",
    date: "2023-10-24",
  },
  {
    id: "#DH-1023",
    customer: "Le Thi B",
    total: 1200000,
    status: "Processing",
    date: "2023-10-24",
  },
  {
    id: "#DH-1022",
    customer: "Tran Van C",
    total: 450000,
    status: "Shipped",
    date: "2023-10-23",
  },
  {
    id: "#DH-1021",
    customer: "Pham Minh D",
    total: 950000,
    status: "Paid",
    date: "2023-10-23",
  },
  {
    id: "#DH-1020",
    customer: "Hoang Thi E",
    total: 600000,
    status: "Shipped",
    date: "2023-10-22",
  },
];

// --- SHARED COMPONENTS ---

// Component nút liên kết trong sidebar với icon, label và trạng thái active
const SidebarLink = ({ icon: Icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
      active
        ? "bg-[#13ec5b]/10 text-[#13ec5b] border border-[#13ec5b]/20 font-bold"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800 font-medium"
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

// Component thẻ thống kê hiển thị chỉ số (doanh thu, đơn hàng, số khách...)
const StatCard = ({ label, value, trend, isUp, icon: Icon, colorClass }) => (
  <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div
        className={`p-2.5 rounded-xl ${colorClass || "bg-[#13ec5b]/10 text-[#13ec5b]"}`}
      >
        <Icon size={22} />
      </div>
      <span
        className={`text-xs font-bold flex items-center gap-1 ${isUp ? "text-[#13ec5b]" : "text-amber-500"}`}
      >
        {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {trend}
      </span>
    </div>
    <p className="text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
      {label}
    </p>
    <h3 className="text-slate-900 dark:text-white text-2xl font-black mt-1">
      {value}
    </h3>
  </div>
);

// --- DASHBOARD VIEW ---

// View tổng quan: hiển thị thống kê, biểu đồ doanh thu, danh mục phổ biến và bảng đơn hàng
const DashboardView = () => {
  // Dữ liệu biểu đồ cột theo các ngày trong tuần
  const chartData = [
    { label: "Mon", height: "32%" },
    { label: "Tue", height: "65%" },
    { label: "Wed", height: "45%" },
    { label: "Thu", height: "90%" },
    { label: "Fri", height: "75%" },
    { label: "Sat", height: "100%" },
    { label: "Sun", height: "25%" },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Hàng 4 thẻ thống kê: doanh thu, đơn hàng, khách hàng mới, đơn chờ xử lý */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Revenue"
          value="12.450.000₫"
          trend="+12.5%"
          isUp
          icon={CreditCard}
        />
        <StatCard
          label="Total Orders"
          value="342"
          trend="+8.2%"
          isUp
          icon={ShoppingBag}
          colorClass="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          label="New Customers"
          value="56"
          trend="+4.1%"
          isUp
          icon={UserPlus}
          colorClass="bg-purple-500/10 text-purple-500"
        />
        <StatCard
          label="Pending Orders"
          value="12"
          trend="-2.4%"
          isUp={false}
          icon={Clock}
          colorClass="bg-amber-500/10 text-amber-500"
        />
      </div>

      {/* Hàng biểu đồ: biểu đồ cột doanh thu (trái) và danh mục phổ biến (phải) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Biểu đồ cột doanh thu theo thời gian */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-slate-900 dark:text-white text-lg font-bold">
              Revenue by Time
            </h2>
            {/* Dropdown chọn khoảng thời gian xem dữ liệu */}
            <select className="bg-slate-50 dark:bg-zinc-800 border-none rounded-lg text-xs font-bold text-slate-500 focus:ring-0 cursor-pointer py-2 px-4">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          {/* Các cột biểu đồ doanh thu theo ngày */}
          <div className="h-64 flex items-end justify-between gap-3 px-2">
            {chartData.map((item, idx) => (
              <div
                key={idx}
                className="w-full bg-slate-50 dark:bg-zinc-800/50 h-full rounded-t-xl relative group flex items-end"
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

        {/* Biểu đồ tròn danh mục phổ biến */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <h2 className="text-slate-900 dark:text-white text-lg font-bold mb-6">
            Popular Categories
          </h2>
          <div className="flex flex-col items-center">
            {/* Vòng tròn tiến trình hiển thị tốc độ tăng trưởng */}
            <div className="relative size-44 rounded-full border-[18px] border-slate-100 dark:border-zinc-800 flex items-center justify-center mb-8">
              <div className="absolute inset-0 rounded-full border-[18px] border-t-[#13ec5b] border-r-[#13ec5b]/60 border-transparent rotate-45"></div>
              <div className="text-center">
                <p className="text-3xl font-black text-slate-900 dark:text-white">
                  85%
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                  Growth
                </p>
              </div>
            </div>
            {/* Danh sách chi tiết các danh mục */}
            <div className="w-full space-y-4">
              {[
                { label: "Birthday", val: "45%", color: "bg-[#13ec5b]" },
                { label: "Wedding", val: "30%", color: "bg-blue-500" },
                { label: "Anniversary", val: "25%", color: "bg-purple-500" },
              ].map((cat) => (
                <div
                  key={cat.label}
                  className="flex items-center justify-between text-xs font-bold"
                >
                  <div className="flex items-center gap-2">
                    <div className={`size-2.5 rounded-full ${cat.color}`}></div>
                    <span className="text-slate-600 dark:text-zinc-400">
                      {cat.label}
                    </span>
                  </div>
                  <span className="text-slate-900 dark:text-white">
                    {cat.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bảng danh sách đơn hàng gần đây với các trạng thái khác nhau */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800">
          <h2 className="text-slate-900 dark:text-white text-lg font-bold">
            Latest Orders
          </h2>
          {/* Nút xem tất cả đơn hàng */}
          <button className="text-[#13ec5b] text-sm font-bold hover:underline">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            {/* Tiêu đề cột: Mã đơn, Khách hàng, Tổng tiền, Trạng thái, Thao tác */}
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-800/30">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            {/* Nội dung bảng: liệt kê các đơn hàng */}
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {RECENT_ORDERS.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors group"
                >
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-zinc-400 font-medium">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                    {order.total.toLocaleString()}₫
                  </td>
                  {/* Badge trạng thái đơn hàng */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        order.status === "Paid"
                          ? "bg-[#13ec5b]/20 text-green-700 dark:text-[#13ec5b]"
                          : order.status === "Processing"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
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

// --- MAIN COMPONENT ---

// Component chính của trang dashboard: quản lý state view hiện tại và từ khóa tìm kiếm
export default function DashboardPage() {
  // Trạng thái view hiện tại: 'dashboard' hoặc 'products'
  const [currentView, setCurrentView] = useState("dashboard");
  // Từ khóa tìm kiếm trong ô search
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f8f6] dark:bg-[#102216] font-['Inter',_sans-serif] text-slate-900 dark:text-slate-100">
      {/* Sidebar bên trái: logo, menu điều hướng, thông tin người dùng */}
      <aside className="hidden lg:flex w-72 flex-shrink-0 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex-col h-full">
        <div className="p-8">
          {/* Logo và tên ứng dụng */}
          <div className="flex items-center gap-3">
            <div className="bg-[#13ec5b]/20 p-2.5 rounded-xl">
              <Flower2 className="text-[#13ec5b]" size={28} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-xl font-black leading-none tracking-tight">
                BloomAdmin
              </h1>
              <p className="text-slate-500 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                Management System
              </p>
            </div>
          </div>
        </div>

        {/* Menu điều hướng chính */}
        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          <SidebarLink
            icon={LayoutDashboard}
            label="Dashboard"
            active={currentView === "dashboard"}
            onClick={() => setCurrentView("dashboard")}
          />
          <SidebarLink icon={Package} label="Products" />
          <SidebarLink icon={ShoppingBag} label="Orders" badge="12" />
          <SidebarLink icon={Users} label="Customers" />
          <SidebarLink icon={BarChart3} label="Reports" />
          {/* Phân chia dòng cho nhóm cài đặt */}
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-zinc-800">
            <SidebarLink icon={Settings} label="Settings" />
          </div>
        </nav>

        {/* Thông tin người dùng đang đăng nhập */}
        <div className="p-6 border-t border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-2xl transition-all cursor-pointer group">
            <img
              className="size-11 rounded-full object-cover border-2 border-[#13ec5b]/20 group-hover:border-[#13ec5b] transition-all"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
              alt="Alex Rivera"
            />
            <div className="flex flex-col overflow-hidden">
              <p className="text-slate-900 dark:text-white text-sm font-bold truncate">
                Alex Rivera
              </p>
              <p className="text-slate-500 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-tighter">
                Store Owner
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Khu vực nội dung chính: header cố định và nội dung động */}
      <main className="flex-1 overflow-y-auto flex flex-col bg-[#f6f8f6] dark:bg-[#102216]">
        {/* Header cố định: tiêu đề, ô tìm kiếm, thông báo, nút thêm */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl px-8 py-5">
          <div className="flex items-center gap-8">
            {/* Tiêu đề trang thay đổi theo view hiện tại */}
            <h2 className="text-slate-900 dark:text-white text-2xl font-black tracking-tight uppercase">
              {currentView === "dashboard"
                ? "Dashboard Overview"
                : "Product Catalog"}
            </h2>
            {/* Ô tìm kiếm sản phẩm hoặc đơn hàng */}
            <div className="relative hidden md:block w-80">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border-none rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-500 text-sm font-medium focus:ring-2 focus:ring-[#13ec5b] transition-all shadow-inner"
                placeholder={
                  currentView === "dashboard"
                    ? "Search orders..."
                    : "Search flower name, product ID..."
                }
                type="text"
              />
            </div>
          </div>

          {/* Nhóm nút: thông báo, thêm mới */}
          <div className="flex items-center gap-4">
            {/* Nút thông báo với badge đỏ */}
            <button className="relative p-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all shadow-sm">
              <Bell size={20} />
              <span className="absolute top-3 right-3 flex h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-zinc-900"></span>
            </button>
            {/* Nút thêm sản phẩm hoặc đơn hàng mới */}
            <button className="flex items-center gap-2 bg-[#13ec5b] text-[#102216] px-6 py-3 rounded-xl text-sm font-black shadow-lg shadow-[#13ec5b]/30 hover:scale-105 active:scale-95 transition-all">
              <PlusCircle size={20} />
              <span>
                {currentView === "dashboard" ? "Create Order" : "Add Product"}
              </span>
            </button>
          </div>
        </header>

        {/* Nội dung chính: hiển thị DashboardView hoặc ProductsView theo currentView */}
        <div className="p-8 max-w-[1400px] mx-auto w-full">
          {currentView === "dashboard" ? <DashboardView /> : <ProductsView />}
        </div>
      </main>
    </div>
  );
}

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

// Dữ liệu đơn hàng (match với Prisma Order model)
const ORDERS = [
  {
    id: "1024-uuid-001",
    createdAt: "24/05/2024",
    name: "Nguyễn Văn A",
    shippingPhone: "0901234567",
    totalPrice: 1200000,
    paymentStatus: "paid",
    status: "pending",
    items: [
      {
        id: "1",
        name: "Hoa Hồng Đỏ",
        price: 500000,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=100&h=100&fit=crop",
      },
      {
        id: "2",
        name: "Hoa Tulip",
        price: 200000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1568452649854-c7c183b48b15?w=100&h=100&fit=crop",
      },
    ],
  },
  {
    id: "1025-uuid-002",
    createdAt: "24/05/2024",
    name: "Trần Thị B",
    shippingPhone: "0912345678",
    totalPrice: 850000,
    paymentStatus: "unpaid",
    status: "processing",
    items: [
      {
        id: "3",
        name: "Hoa Hướng Dương",
        price: 350000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1597848212624-e27f55e90469?w=100&h=100&fit=crop",
      },
      {
        id: "4",
        name: "Hoa Cúc",
        price: 500000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=100&h=100&fit=crop",
      },
    ],
  },
  {
    id: "1026-uuid-003",
    createdAt: "23/05/2024",
    name: "Lê Văn C",
    shippingPhone: "0987654321",
    totalPrice: 2100000,
    paymentStatus: "paid",
    status: "completed",
    items: [
      {
        id: "5",
        name: "Bó Hoa Phong Phú",
        price: 1200000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop",
      },
      {
        id: "6",
        name: "Hoa Ly",
        price: 450000,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1583822261290-991b38693d1b?w=100&h=100&fit=crop",
      },
    ],
  },
  {
    id: "1027-uuid-004",
    createdAt: "23/05/2024",
    name: "Phạm Thị D",
    shippingPhone: "0905556667",
    totalPrice: 450000,
    paymentStatus: "paid",
    status: "cancelled",
    items: [
      {
        id: "7",
        name: "Hoa Lãng Quân",
        price: 450000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=100&h=100&fit=crop",
      },
    ],
  },
  {
    id: "1028-uuid-005",
    createdAt: "22/05/2024",
    name: "Hoàng Văn E",
    shippingPhone: "0933444555",
    totalPrice: 1550000,
    paymentStatus: "unpaid",
    status: "pending",
    items: [
      {
        id: "8",
        name: "Hoa Hồng Hồng",
        price: 600000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1564501049351-8e9f6707ae41?w=100&h=100&fit=crop",
      },
      {
        id: "9",
        name: "Hoa Huệ",
        price: 950000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1562784335-38a5c3a37537?w=100&h=100&fit=crop",
      },
    ],
  },
];

// Badge trạng thái
const StatusBadge = ({
  label,
  type = "status",
}: {
  label: string;
  type?: "payment" | "status";
}) => {
  // Payment Status Styles
  const paymentStyles: Record<string, string> = {
    paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    unpaid: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  // Order Status Styles
  const statusStyles: Record<string, string> = {
    pending:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    processing:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    completed: "bg-[#13ec5b]/10 text-green-700 dark:text-[#13ec5b]",
    cancelled:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  };

  const paymentLabels: Record<string, string> = {
    paid: "Đã thanh toán",
    unpaid: "Chưa thanh toán",
  };

  const statusLabels: Record<string, string> = {
    pending: "Chờ xử lý",
    processing: "Đang giao",
    completed: "Đã giao",
    cancelled: "Đã hủy",
  };

  const isPayment = type === "payment";
  const styles = isPayment ? paymentStyles : statusStyles;
  const displayLabel = isPayment
    ? paymentLabels[label] || label
    : statusLabels[label] || label;
  const styleClass = styles[label] || "bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${styleClass}`}
    >
      {displayLabel}
    </span>
  );
};

// Component chính
export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const tabs = useMemo(
    () => [
      { name: "Tất cả", value: "all", count: 128 },
      { name: "Chờ xử lý", value: "pending", count: 12 },
      { name: "Đang giao", value: "processing", count: 45 },
      { name: "Đã giao", value: "completed", count: 68 },
      { name: "Đã hủy", value: "cancelled", count: 3 },
    ],
    [],
  );

  // Lọc đơn hàng theo tìm kiếm và tab
  const filteredOrders = useMemo(() => {
    let result = ORDERS.filter((order) => {
      const matchSearch =
        order.id.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        order.name.toLowerCase().includes(searchKeyword.toLowerCase());
      const activeTabObj = tabs.find((tab) => tab.name === activeTab);
      const matchTab =
        activeTabObj?.value === "all" || order.status === activeTabObj?.value;

      // Parse date từ format DD/MM/YYYY
      const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split("/").map(Number);
        return new Date(year, month - 1, day);
      };

      const orderDate = parseDate(order.createdAt);
      let matchDate = true;

      if (dateFrom) {
        const fromDate = parseDate(dateFrom);
        matchDate = matchDate && orderDate >= fromDate;
      }

      if (dateTo) {
        const toDate = parseDate(dateTo);
        matchDate = matchDate && orderDate <= toDate;
      }

      const matchPaymentStatus =
        paymentStatusFilter === "all" ||
        order.paymentStatus === paymentStatusFilter;

      return matchSearch && matchTab && matchDate && matchPaymentStatus;
    });

    // Sắp xếp đơn hàng
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.totalPrice - b.totalPrice;
        case "price-desc":
          return b.totalPrice - a.totalPrice;
        case "date-newest": {
          const parseDate = (dateStr: string) => {
            const [day, month, year] = dateStr.split("/").map(Number);
            return new Date(year, month - 1, day);
          };
          return (
            parseDate(b.createdAt).getTime() -  parseDate(a.createdAt).getTime()
          );
        }
        case "date-oldest": {
          const parseDate = (dateStr: string) => {
            const [day, month, year] = dateStr.split("/").map(Number);
            return new Date(year, month - 1, day);
          };
          return (
            parseDate(a.createdAt).getTime() - parseDate(b.createdAt).getTime()
          );
        }
        default:
          return 0;
      }
    });

    return result;
  }, [
    searchKeyword,
    activeTab,
    tabs,
    dateFrom,
    dateTo,
    paymentStatusFilter,
    sortBy,
  ]);

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
          <div className="p-4 flex flex-col gap-4">
            {/* Hàng đầu - Tìm kiếm */}
            <div className="flex flex-col sm:flex-row gap-4">
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

            {/* Hàng thứ hai - Lọc theo thời gian và thanh toán */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 uppercase mb-1">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="px-3 py-2 text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#13ec5b]/50"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 uppercase mb-1">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="px-3 py-2 text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#13ec5b]/50"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 uppercase mb-1">
                  Trạng thái thanh toán
                </label>
                <select
                  value={paymentStatusFilter}
                  onChange={(e) => setPaymentStatusFilter(e.target.value)}
                  className="px-3 py-2 text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#13ec5b]/50"
                >
                  <option value="all">Tất cả</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="unpaid">Chưa thanh toán</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 uppercase mb-1">
                  Sắp xếp theo
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#13ec5b]/50"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="price-asc">Giá (thấp → cao)</option>
                  <option value="price-desc">Giá (cao → thấp)</option>
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={() => {
                    setDateFrom("");
                    setDateTo("");
                    setPaymentStatusFilter("all");
                    setSortBy("newest");
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-700 transition-all"
                >
                  Xóa lọc
                </button>
                <button className="px-4 py-2 text-xs font-bold text-white bg-[#13ec5b] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-sm">
                  Áp dụng lọc
                </button>
              </div>
            </div>
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
                    Tên khách hàng
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Số điện thoại giao
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                    Thanh toán
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                    Trạng thái
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
                      {order.createdAt}
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-900 dark:text-white">
                      {order.name}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                      {order.shippingPhone}
                    </td>
                    <td className="px-6 py-5 text-sm font-black text-slate-900 dark:text-white text-right">
                      ₫{Math.floor(order.totalPrice).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <StatusBadge label={order.paymentStatus} type="payment" />
                    </td>
                    <td className="px-6 py-5 text-center">
                      <StatusBadge label={order.status} type="status" />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === "pending" && (
                          <button className="bg-[#13ec5b] text-[#102216] text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100">
                            Giao hàng
                          </button>
                        )}
                        {order.status === "processing" && (
                          <button className="bg-blue-500 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100">
                            Hoàn tất
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedOrderId(order.id)}
                          className="p-2 text-slate-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/10 rounded-xl transition-all"
                        >
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

      {/* Order Detail Modal */}
      {selectedOrderId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-zinc-800 shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Chi tiết đơn hàng
              </h2>
              <button
                onClick={() => setSelectedOrderId(null)}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {ORDERS.find((o) => o.id === selectedOrderId) &&
                (() => {
                  const order = ORDERS.find((o) => o.id === selectedOrderId)!;
                  return (
                    <div className="space-y-6">
                      {/* Order ID */}
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                          Mã đơn
                        </p>
                        <p className="text-lg font-black text-[#13ec5b]">
                          {order.id}
                        </p>
                      </div>

                      {/* Customer Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                            Tên khách hàng
                          </p>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {order.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                            Số điện thoại
                          </p>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {order.shippingPhone}
                          </p>
                        </div>
                      </div>

                      {/* Dates and Status */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                            Ngày đặt
                          </p>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {order.createdAt}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                            Tổng tiền
                          </p>
                          <p className="font-black text-lg text-slate-900 dark:text-white">
                            ₫
                            {Math.floor(order.totalPrice).toLocaleString(
                              "vi-VN",
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Payment & Status */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                            Trạng thái thanh toán
                          </p>
                          <StatusBadge
                            label={order.paymentStatus}
                            type="payment"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                            Trạng thái đơn hàng
                          </p>
                          <StatusBadge label={order.status} type="status" />
                        </div>
                      </div>

                      {/* Products Table */}
                      <div className="border-t border-slate-200 dark:border-zinc-800 pt-6">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                          Thông tin sản phẩm
                        </p>
                        <div className="bg-slate-50 dark:bg-zinc-800/30 rounded-xl overflow-hidden">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-100 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
                                <th className="px-4 py-3 text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                  Ảnh
                                </th>
                                <th className="px-4 py-3 text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                  Tên sản phẩm
                                </th>
                                <th className="px-4 py-3 text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider text-center">
                                  Số lượng
                                </th>
                                <th className="px-4 py-3 text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider text-right">
                                  Đơn giá
                                </th>
                                <th className="px-4 py-3 text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider text-right">
                                  Thành tiền
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-zinc-700">
                              {order.items.map((item) => (
                                <tr
                                  key={item.id}
                                  className="hover:bg-slate-100 dark:hover:bg-zinc-800/50 transition-colors"
                                >
                                  <td className="px-4 py-3">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-zinc-700"
                                    />
                                  </td>
                                  <td className="px-4 py-3 text-sm font-bold text-slate-900 dark:text-white">
                                    {item.name}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 text-center">
                                    {item.quantity}
                                  </td>
                                  <td className="px-4 py-3 text-sm font-bold text-slate-900 dark:text-white text-right">
                                    ₫
                                    {Math.floor(item.price).toLocaleString(
                                      "vi-VN",
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-sm font-black text-slate-900 dark:text-white text-right">
                                    ₫
                                    {Math.floor(
                                      item.price * item.quantity,
                                    ).toLocaleString("vi-VN")}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="bg-slate-100 dark:bg-zinc-800/50 px-4 py-3 border-t border-slate-200 dark:border-zinc-700 flex justify-end">
                            <div className="text-sm">
                              <span className="font-bold text-slate-600 dark:text-slate-400">
                                Tổng cộng:{" "}
                              </span>
                              <span className="font-black text-lg text-[#13ec5b]">
                                ₫
                                {Math.floor(order.totalPrice).toLocaleString(
                                  "vi-VN",
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
                        {order.status === "pending" && (
                          <button className="flex-1 bg-[#13ec5b] text-[#102216] font-black py-2 rounded-lg hover:scale-105 transition-all">
                            Xác nhận giao hàng
                          </button>
                        )}
                        {order.status === "processing" && (
                          <button className="flex-1 bg-blue-500 text-white font-black py-2 rounded-lg hover:scale-105 transition-all">
                            Hoàn tất đơn hàng
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedOrderId(null)}
                          className="flex-1 bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white font-black py-2 rounded-lg hover:scale-105 transition-all"
                        >
                          Đóng
                        </button>
                      </div>
                    </div>
                  );
                })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

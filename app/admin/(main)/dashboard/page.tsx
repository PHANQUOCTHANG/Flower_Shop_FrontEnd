"use client";

import React, { useMemo } from "react";
import {
  Bell,
  TrendingUp,
  TrendingDown,
  CreditCard,
  ShoppingBag,
  UserPlus,
  Clock,
  RefreshCw,
  AlertCircle,
  Medal,
  Package,
} from "lucide-react";
import { useDashboard } from "@/features/admin/dashboard/hooks/useDashboard";
import { DashboardStats, KpiSnapshot } from "@/features/admin/dashboard/types/dashboard.types";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatVND(amount: number): string {
  if (amount >= 1_000_000_000)
    return `₫${(amount / 1_000_000_000).toFixed(1)}tỷ`;
  if (amount >= 1_000_000) return `₫${(amount / 1_000_000).toFixed(1)}tr`;
  return `₫${amount.toLocaleString("vi-VN")}`;
}

function calcPct(current: number, prev: number): { pct: string; isUp: boolean } {
  if (prev === 0) return { pct: current > 0 ? "+100%" : "0%", isUp: current > 0 };
  const diff = ((current - prev) / prev) * 100;
  const isUp = diff >= 0;
  return { pct: `${isUp ? "+" : ""}${diff.toFixed(1)}%`, isUp };
}

const CATEGORY_COLORS = [
  "#13ec5b",
  "#3b82f6",
  "#a855f7",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#EE2B5B",
  "#84cc16",
];

// ─── StatCard ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  pct: string;
  isUp: boolean;
  icon: React.ElementType;
  accentColor: string;
  bgColor: string;
}

const StatCard = ({
  label,
  value,
  pct,
  isUp,
  icon: Icon,
  accentColor,
  bgColor,
}: StatCardProps) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div
        className="p-2.5 rounded-xl"
        style={{ backgroundColor: bgColor, color: accentColor }}
      >
        <Icon size={20} />
      </div>
      <span
        className="flex items-center gap-1 text-xs font-bold"
        style={{ color: isUp ? "#13ec5b" : "#f59e0b" }}
      >
        {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        {pct}
      </span>
    </div>
    <div>
      <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1">
        {label}
      </p>
      <h3 className="text-slate-900 text-2xl font-black">{value}</h3>
    </div>
    <p className="text-slate-400 text-[11px]">So với tháng trước</p>
  </div>
);

// ─── Revenue Chart ────────────────────────────────────────────────────────────

interface RevenueChartProps {
  data: DashboardStats["revenueByDay"];
}

const RevenueChart = ({ data }: RevenueChartProps) => {
  const maxRevenue = useMemo(
    () => Math.max(...data.map((d) => d.revenue), 1),
    [data],
  );

  const totalRevenue = useMemo(
    () => data.reduce((s, d) => s + d.revenue, 0),
    [data],
  );

  const totalOrders = useMemo(
    () => data.reduce((s, d) => s + d.orders, 0),
    [data],
  );

  // Chỉ hiển thị label cho ngày 1, 5, 10, 15, 20, 25, cuối tháng
  const shouldShowLabel = (dateStr: string) => {
    const day = parseInt(dateStr.split("-")[2]);
    return [1, 5, 10, 15, 20, 25].includes(day) || day === data.length;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-slate-900 text-base font-bold">
            Doanh thu theo ngày
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Tháng hiện tại · Đơn hoàn thành</p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="text-right">
            <p className="text-slate-400 font-medium">Tổng DT</p>
            <p className="text-slate-900 font-black">{formatVND(totalRevenue)}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 font-medium">Tổng đơn</p>
            <p className="text-slate-900 font-black">{totalOrders}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        {/* Y-axis guidelines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[100, 75, 50, 25, 0].map((pct) => (
            <div
              key={pct}
              className="w-full border-t border-dashed border-slate-100"
            />
          ))}
        </div>

        {/* Bars */}
        <div className="flex items-end gap-[2px] h-40 sm:h-52 px-1 pt-4">
          {data.map((d, i) => {
            const heightPct = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0;
            const hasData = d.revenue > 0;
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center justify-end h-full group relative"
              >
                {/* Tooltip */}
                {hasData && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] rounded-lg px-2 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-lg">
                    <p className="font-bold">{d.date.split("-")[2]}/{d.date.split("-")[1]}</p>
                    <p>{formatVND(d.revenue)}</p>
                    <p>{d.orders} đơn</p>
                  </div>
                )}
                <div
                  className="w-full rounded-t-md transition-all duration-500"
                  style={{
                    height: `${Math.max(heightPct, hasData ? 2 : 0)}%`,
                    backgroundColor: hasData ? "#13ec5b" : "#f1f5f9",
                    opacity: hasData ? 1 : 0.4,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="flex items-end gap-[2px] px-1 mt-1">
          {data.map((d, i) => {
            const day = d.date.split("-")[2];
            const show = shouldShowLabel(d.date);
            return (
              <div key={i} className="flex-1 flex justify-center">
                {show && (
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">
                    {day}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Category Donut Chart ─────────────────────────────────────────────────────

interface CategoryChartProps {
  data: DashboardStats["categoryDistribution"];
}

const CategoryChart = ({ data }: CategoryChartProps) => {
  const total = useMemo(() => data.reduce((s, c) => s + c.quantity, 0), [data]);

  // Build SVG donut segments
  const segments = useMemo(() => {
    const cx = 60;
    const cy = 60;
    const r = 48;
    const gap = 3; // degrees gap between segments
    let currentAngle = -90;
    const result = [];

    for (let i = 0; i < data.length; i++) {
      const cat = data[i];
      const segAngle = (cat.percentage / 100) * (360 - data.length * gap);
      const startAngle = currentAngle;
      const endAngle = currentAngle + segAngle;

      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const x1 = cx + r * Math.cos(toRad(startAngle));
      const y1 = cy + r * Math.sin(toRad(startAngle));
      const x2 = cx + r * Math.cos(toRad(endAngle));
      const y2 = cy + r * Math.sin(toRad(endAngle));
      const largeArc = segAngle > 180 ? 1 : 0;

      result.push({
        d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`,
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
        name: cat.name,
        percentage: cat.percentage,
        quantity: cat.quantity,
      });

      currentAngle = endAngle + gap;
    }
    return result;
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col items-center justify-center gap-2 min-h-[200px]">
        <Package size={32} className="text-slate-300" />
        <p className="text-slate-400 text-sm">Chưa có dữ liệu danh mục</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
      <div>
        <h2 className="text-slate-900 text-base font-bold">Danh mục phổ biến</h2>
        <p className="text-slate-400 text-xs mt-0.5">Theo số lượng bán · Tháng này</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* SVG Donut */}
        <div className="relative shrink-0">
          <svg viewBox="0 0 120 120" className="w-32 h-32">
            {segments.map((seg, i) => (
              <path
                key={i}
                d={seg.d}
                fill={seg.color}
                opacity={0.9}
              />
            ))}
            {/* Center hole */}
            <circle cx="60" cy="60" r="32" fill="white" />
            <text
              x="60"
              y="57"
              textAnchor="middle"
              className="text-slate-900 font-black"
              fontSize="14"
              fontWeight="900"
              fill="#0f172a"
            >
              {total}
            </text>
            <text
              x="60"
              y="70"
              textAnchor="middle"
              fontSize="8"
              fill="#94a3b8"
              fontWeight="600"
            >
              SẢN PHẨM
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5 w-full min-w-0">
          {data.slice(0, 6).map((cat, i) => (
            <div key={cat.name} className="flex items-center gap-2">
              <span
                className="shrink-0 w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
              />
              <span className="text-slate-600 text-xs flex-1 truncate">{cat.name}</span>
              <span className="text-slate-900 text-xs font-bold shrink-0">
                {cat.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Top Products Leaderboard ─────────────────────────────────────────────────

interface TopProductsProps {
  data: DashboardStats["topProducts"];
}

const MEDAL_COLORS = ["#f59e0b", "#94a3b8", "#b45309"];

const TopProductsTable = ({ data }: TopProductsProps) => {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center gap-2 min-h-[200px]">
        <Package size={32} className="text-slate-300" />
        <p className="text-slate-400 text-sm">Chưa có sản phẩm bán ra trong tháng</p>
      </div>
    );
  }

  const maxQty = data[0]?.totalQuantity ?? 1;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-slate-900 text-base font-bold">Sản phẩm bán chạy</h2>
          <p className="text-slate-400 text-xs mt-0.5">Top 10 · Tháng hiện tại</p>
        </div>
        <Medal size={18} className="text-amber-400" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider w-10">
                #
              </th>
              <th className="px-3 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-3 py-3 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                SL bán
              </th>
              <th className="px-5 py-3 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                Doanh thu
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((product, idx) => {
              const barWidth = maxQty > 0 ? (product.totalQuantity / maxQty) * 100 : 0;
              const isMedal = idx < 3;
              return (
                <tr
                  key={product.productId}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* Rank */}
                  <td className="px-5 py-3.5 text-center">
                    {isMedal ? (
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-black text-white"
                        style={{ backgroundColor: MEDAL_COLORS[idx] }}
                      >
                        {idx + 1}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs font-bold">{idx + 1}</span>
                    )}
                  </td>

                  {/* Product */}
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      {product.thumbnailUrl ? (
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                          <OptimizedImage
                            src={product.thumbnailUrl}
                            alt={product.name}
                            fill
                            sizes="36px"
                          />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <Package size={14} className="text-slate-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-slate-900 font-semibold text-xs truncate max-w-[140px] sm:max-w-[200px]">
                          {product.name}
                        </p>
                        {/* Progress bar */}
                        <div className="mt-1 h-1.5 bg-slate-100 rounded-full w-24 sm:w-32">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${barWidth}%`,
                              backgroundColor: isMedal
                                ? MEDAL_COLORS[idx]
                                : "#13ec5b",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="px-3 py-3.5 text-right">
                    <span className="text-slate-900 font-bold text-sm">
                      {product.totalQuantity}
                    </span>
                    <span className="text-slate-400 text-xs ml-1">sp</span>
                  </td>

                  {/* Revenue */}
                  <td className="px-5 py-3.5 text-right hidden sm:table-cell">
                    <span className="text-slate-900 font-bold text-xs">
                      {formatVND(product.totalRevenue)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 rounded-xl ${className ?? ""}`} />
);

const DashboardSkeleton = () => (
  <div className="flex flex-col gap-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-4">
          <div className="flex justify-between">
            <Skeleton className="w-10 h-10" />
            <Skeleton className="w-16 h-5" />
          </div>
          <Skeleton className="w-24 h-3" />
          <Skeleton className="w-32 h-7" />
          <Skeleton className="w-20 h-3" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Skeleton className="lg:col-span-2 h-64" />
      <Skeleton className="h-64" />
    </div>
    <Skeleton className="h-80" />
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const DashboardContent = ({
  stats,
  isLoading,
  error,
  refresh,
}: {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}) => {
  const now = new Date();
  const monthLabel = now.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });

  if (isLoading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <AlertCircle size={40} className="text-red-400" />
        <p className="text-slate-600 font-medium">{error}</p>
        <button
          onClick={refresh}
          className="flex items-center gap-2 px-4 py-2 bg-[#13ec5b] text-white text-sm font-bold rounded-xl hover:bg-[#0fd44f] transition-colors"
        >
          <RefreshCw size={15} /> Thử lại
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const { currentMonth: cur, prevMonth: prev } = stats;

  const kpiCards: (StatCardProps & { key: keyof KpiSnapshot })[] = [
    {
      key: "totalRevenue",
      label: "Tổng doanh thu",
      value: formatVND(cur.totalRevenue),
      ...calcPct(cur.totalRevenue, prev.totalRevenue),
      icon: CreditCard,
      accentColor: "#13ec5b",
      bgColor: "rgba(19,236,91,0.1)",
    },
    {
      key: "totalOrders",
      label: "Tổng đơn hàng",
      value: cur.totalOrders.toLocaleString(),
      ...calcPct(cur.totalOrders, prev.totalOrders),
      icon: ShoppingBag,
      accentColor: "#3b82f6",
      bgColor: "rgba(59,130,246,0.1)",
    },
    {
      key: "newCustomers",
      label: "Khách hàng mới",
      value: cur.newCustomers.toLocaleString(),
      ...calcPct(cur.newCustomers, prev.newCustomers),
      icon: UserPlus,
      accentColor: "#a855f7",
      bgColor: "rgba(168,85,247,0.1)",
    },
    {
      key: "pendingOrders",
      label: "Đơn chờ xử lý",
      value: cur.pendingOrders.toLocaleString(),
      ...calcPct(cur.pendingOrders, prev.pendingOrders),
      icon: Clock,
      accentColor: "#f59e0b",
      bgColor: "rgba(245,158,11,0.1)",
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Month label */}
      <p className="text-slate-400 text-sm font-medium -mb-2">
        📅 Dữ liệu tháng hiện tại · {monthLabel}
      </p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(({ key: cardKey, ...card }) => (
          <StatCard key={cardKey} {...card} />
        ))}
      </div>

      {/* Revenue Chart + Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={stats.revenueByDay} />
        </div>
        <CategoryChart data={stats.categoryDistribution} />
      </div>

      {/* Top Products */}
      <TopProductsTable data={stats.topProducts} />
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { stats, isLoading, error, refresh } = useDashboard();

  return (
    <div className="flex flex-col h-full overflow-auto bg-[#f6f8f6] font-['Inter',_sans-serif]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl px-4 sm:px-6 md:px-8 py-4">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <div>
            <h1 className="text-slate-900 text-xl sm:text-2xl font-black uppercase tracking-tight">
              Tổng quan
            </h1>
            <p className="text-slate-400 text-xs mt-0.5 hidden sm:block">
              Thống kê hoạt động kinh doanh theo tháng
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="dashboard-refresh-btn"
              onClick={refresh}
              disabled={isLoading}
              className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50"
              title="Làm mới dữ liệu"
            >
              <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            </button>
            <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto w-full">
        <DashboardContent
          stats={stats}
          isLoading={isLoading}
          error={error}
          refresh={refresh}
        />
      </main>
    </div>
  );
}

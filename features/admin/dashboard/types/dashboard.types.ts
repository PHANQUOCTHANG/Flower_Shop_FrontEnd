// ─── Dashboard API Types ───────────────────────────────────────────────────────

export interface KpiSnapshot {
  totalRevenue: number;
  totalOrders: number;
  newCustomers: number;
  pendingOrders: number;
}

export interface RevenueByDay {
  date: string;    // "YYYY-MM-DD"
  revenue: number;
  orders: number;
}

export interface CategoryDistribution {
  name: string;
  quantity: number;
  percentage: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  thumbnailUrl: string | null;
  totalQuantity: number;
  totalRevenue: number;
}

export interface DashboardStats {
  currentMonth: KpiSnapshot;
  prevMonth: KpiSnapshot;
  revenueByDay: RevenueByDay[];
  categoryDistribution: CategoryDistribution[];
  topProducts: TopProduct[];
}

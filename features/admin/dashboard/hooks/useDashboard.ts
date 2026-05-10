"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { DashboardStats } from "../types/dashboard.types";
import { useAuthStore } from "@/stores/auth.store";

interface UseDashboardReturn {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useDashboard(): UseDashboardReturn {
  const { isSessionReady, isAuthenticated } = useAuthStore();

  const {
    data,
    isLoading: isQueryLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: async () => {
      const res = await api.get<{ data: DashboardStats }>("/orders/dashboard");
      return res.data.data;
    },
    // ✅ QUAN TRỌNG: Chỉ gọi khi session đã sẵn sàng và đã đăng nhập
    enabled: isSessionReady && isAuthenticated,
    staleTime: 0, // Luôn lấy dữ liệu mới nhất
    refetchOnWindowFocus: true, // Tự động cập nhật khi quay lại Tab
    retry: 1, 
  });

  const stats = data ?? null;
  const isLoading = !isSessionReady || isQueryLoading;
  const error = isError ? "Không thể tải dữ liệu dashboard. Vui lòng thử lại." : null;

  return { 
    stats, 
    isLoading, 
    error, 
    refresh: refetch 
  };
}

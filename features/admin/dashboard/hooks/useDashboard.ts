"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { DashboardStats } from "../types/dashboard.types";

interface UseDashboardReturn {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useDashboard(): UseDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<{ data: DashboardStats }>("/orders/dashboard");
      console.log("Dashboard API Response:",res.data.data) ; 

      setStats(res.data.data);
    } catch {
      setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refresh: fetchStats };
}

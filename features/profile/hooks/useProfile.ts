"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { profileService } from "@/features/profile/services/profileService";
import { MyOrder, MyOrdersResponse } from "@/types/profile";

// ─── Constants ─────────────────────────────────────────────────────────────

export const ORDERS_QUERY_KEY = ["orders", "my-orders"] as const;

// ─── Hooks ─────────────────────────────────────────────────────────────────

export const useGetMyOrders = (
  params?: { page?: number; limit?: number; status?: string; sort?: string },
  enabled = true,
): UseQueryResult<MyOrdersResponse, Error> => {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, params],
    queryFn: async () => {
      const response = await profileService.getMyOrders(params);
      return response;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 phút
    gcTime: 1000 * 60 * 10, // 10 phút
  });
};

/**
 * Wrapper để lấy danh sách đơn hàng được format cho display
 * Chuyển đổi API response sang định dạng display
 */
export const useFetchMyOrders = (
  params?: { page?: number; limit?: number; status?: string; sort?: string },
  enabled = true,
) => {
  const { data, isLoading, error, refetch } = useGetMyOrders(params, enabled);

  const orders: MyOrder[] = data?.data || [];
  const meta = data?.meta;

  return {
    orders,
    meta,
    isLoading,
    error,
    refetch,
  };
};

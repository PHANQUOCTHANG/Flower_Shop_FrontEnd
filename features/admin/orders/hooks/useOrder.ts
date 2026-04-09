/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../services/orderService";
import type { GetOrdersParams } from "../services/orderService";

// Query keys factory
const orderKeys = {
  all: ["admin" , "orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (params?: GetOrdersParams) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (orderId: string) => [...orderKeys.details(), orderId] as const,
};

/**
 * Hook để lấy danh sách đơn hàng
 */
export const useOrders = (params?: GetOrdersParams) => {
  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: orderKeys.list(params),
    queryFn: async () => {
      return await orderService.getOrders(params);
    },
    placeholderData: (previousData) => previousData,
  });

  const orders = data?.orders ?? [];
  const pagination = data?.pagination ?? {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  };
  const meta = data?.meta;

  return {
    orders,
    meta,
    pagination,
    totalPages: pagination.totalPages,
    loading: isPending,
    fetching: isFetching,
    isLoading: isPending,
    isFetching,
    error: error as Error | null,
    isEmpty: orders.length === 0,
    refetch,
  };
};

/**
 * Hook để lấy chi tiết một đơn hàng
 */
export const useOrderById = (orderId: string | null) => {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: orderKeys.detail(orderId ?? ""),
    queryFn: async () => {
      return await orderService.getOrderById(orderId!);
    },
    enabled: !!orderId,
    staleTime: 0,
    refetchOnMount: "always",
    // ❌ bỏ placeholderData — nó giữ data cũ, che mất loading state
  });


  return {
    order: data,
    isLoading,
    isFetching,
    error: error as Error | null,
    refetch,
  };
};

/**
 * Hook để cập nhật trạng thái đơn hàng
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: string;
    }) => {
      return await orderService.updateOrderStatus(orderId, status);
    },

    // Optimistic update: cập nhật UI ngay lập tức trước khi API trả về
    onMutate: async ({ orderId, status }) => {
      // Huỷ các query đang refetch để tránh race condition
      await queryClient.cancelQueries({ queryKey: orderKeys.lists() });
      await queryClient.cancelQueries({ queryKey: orderKeys.detail(orderId) });

      // Snapshot data hiện tại để rollback nếu lỗi
      const previousLists = queryClient.getQueriesData({
        queryKey: orderKeys.lists(),
      });
      const previousDetail = queryClient.getQueryData(
        orderKeys.detail(orderId),
      );

      // Cập nhật tất cả các list cache đang có
      queryClient.setQueriesData(
        { queryKey: orderKeys.lists() },
        (oldData: any) => {
          if (!oldData?.orders) return oldData;
          return {
            ...oldData,
            orders: oldData.orders.map((order: any) =>
              order.id === orderId ? { ...order, status } : order,
            ),
          };
        },
      );

      // Cập nhật detail cache nếu đang mở
      queryClient.setQueryData(orderKeys.detail(orderId), (oldData: any) => {
        if (!oldData) return oldData;
        return { ...oldData, status };
      });

      // Trả về context để dùng trong onError
      return { previousLists, previousDetail };
    },

    // Rollback nếu API lỗi
    onError: (_err, { orderId }, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(
          orderKeys.detail(orderId),
          context.previousDetail,
        );
      }
    },

    // Sync lại với server sau khi mutation hoàn tất (thành công hoặc lỗi)
    onSettled: (_data, _error, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
    },
  });

  return {
    updateStatus: mutate,
    isPending,
    isError,
    error: error as Error | null,
  };
};

/**
 * Hook để cập nhật trạng thái thanh toán
 */
export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async ({
      orderId,
      paymentStatus,
    }: {
      orderId: string;
      paymentStatus: string;
    }) => {
      return await orderService.updatePaymentStatus(orderId, paymentStatus);
    },

    onMutate: async ({ orderId, paymentStatus }) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.lists() });
      await queryClient.cancelQueries({ queryKey: orderKeys.detail(orderId) });

      const previousLists = queryClient.getQueriesData({
        queryKey: orderKeys.lists(),
      });
      const previousDetail = queryClient.getQueryData(
        orderKeys.detail(orderId),
      );

      queryClient.setQueriesData(
        { queryKey: orderKeys.lists() },
        (oldData: any) => {
          if (!oldData?.orders) return oldData;
          return {
            ...oldData,
            orders: oldData.orders.map((order: any) =>
              order.id === orderId ? { ...order, paymentStatus } : order,
            ),
          };
        },
      );

      queryClient.setQueryData(orderKeys.detail(orderId), (oldData: any) => {
        if (!oldData) return oldData;
        return { ...oldData, paymentStatus };
      });

      return { previousLists, previousDetail };
    },

    onError: (_err, { orderId }, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(
          orderKeys.detail(orderId),
          context.previousDetail,
        );
      }
    },

    onSettled: (_data, _error, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
    },
  });

  return {
    updatePaymentStatus: mutate,
    isPending,
    isError,
    error: error as Error | null,
  };
};

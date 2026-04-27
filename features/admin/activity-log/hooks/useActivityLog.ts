"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { activityLogService, GetActivityLogsParams } from "../services/activityLogService";

const logKeys = {
  all: ["admin", "activity-logs"] as const,
  lists: () => [...logKeys.all, "list"] as const,
  list: (params?: GetActivityLogsParams) => [...logKeys.lists(), params] as const,
  unread: () => [...logKeys.all, "unread-count"] as const,
};

export const useActivityLogs = (params?: GetActivityLogsParams) => {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: logKeys.list(params),
    queryFn: () => activityLogService.getAll(params),
    placeholderData: (prev) => prev,
  });

  return {
    logs: data?.data ?? [],
    meta: data?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 0 },
    isLoading,
    isFetching,
    error,
    refetch,
  };
};

export const useUnreadCount = () => {
  const { data } = useQuery({
    queryKey: logKeys.unread(),
    queryFn: activityLogService.getUnreadCount,
    refetchInterval: 30_000, // poll mỗi 30s như một fallback
  });
  return data ?? 0;
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activityLogService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: logKeys.all });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activityLogService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: logKeys.all });
    },
  });
};

// Export keys để dùng trong AdminNotificationProvider
export { logKeys };

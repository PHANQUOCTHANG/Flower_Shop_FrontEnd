import api from "@/lib/axios";
import { ActivityLog, ActivityLogsResponse } from "../types/activityLog";
import { ApiResponse } from "@/types/response";

export interface GetActivityLogsParams {
  page?: number;
  limit?: number;
  type?: string;
}

export const activityLogService = {
  async getAll(params?: GetActivityLogsParams): Promise<ActivityLogsResponse> {
    const res = await api.get<ApiResponse<ActivityLog[]>>("/activity-logs", { params });
    return {
      data: res.data.data ?? [],
      meta: (res.data.meta as any) ?? { total: 0, page: 1, limit: 20, totalPages: 0 },
    };
  },

  async getUnreadCount(): Promise<number> {
    const res = await api.get<ApiResponse<{ count: number }>>("/activity-logs/unread-count");
    return res.data.data?.count ?? 0;
  },

  async markAsRead(id: string): Promise<void> {
    await api.patch(`/activity-logs/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.patch("/activity-logs/read-all");
  },
};

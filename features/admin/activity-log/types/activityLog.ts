export interface ActivityLog {
  id: string;
  type: string;
  message: string;
  data: { orderId?: string; totalPrice?: number } | null;
  isRead: boolean;
  createdAt: string;
}

export interface ActivityLogsResponse {
  data: ActivityLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

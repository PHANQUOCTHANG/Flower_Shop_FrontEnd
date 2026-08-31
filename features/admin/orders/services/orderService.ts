import api from "@/lib/axios";
import { ApiResponse, PaginationMeta } from "@/types/response";
import { OrderResponse } from "@/types/order";

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: "newest" | "oldest" | "price-asc" | "price-desc";
  status?: "pending" | "processing" | "completed" | "cancelled";
  paymentStatus?: "paid" | "unpaid";
  dateFrom?: string;
  dateTo?: string;
}

export interface OrderStatusCounts {
  pending: number;
  processing: number;
  completed: number;
  cancelled: number;
}

interface OrdersMeta extends PaginationMeta {
  statusCounts?: OrderStatusCounts;
}

interface OrdersListResponse {
  orders: OrderResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
  meta?: OrdersMeta;
}

export const orderService = {
  /**
   * Lấy danh sách tất cả đơn hàng
   */
  async getOrders(params?: GetOrdersParams): Promise<OrdersListResponse> {
    const res = await api.get<ApiResponse<OrderResponse[]>>("/orders", {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        ...(params?.search && { search: params.search }),
        ...(params?.status && { status: params.status }),
        ...(params?.paymentStatus && { paymentStatus: params.paymentStatus }),
        ...(params?.dateFrom && { dateFrom: params.dateFrom }),
        ...(params?.dateTo && { dateTo: params.dateTo }),
        ...(params?.sort && { sort: params.sort }),
      },
    });

    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Failed to fetch orders");
    }

    return {
      orders: res.data.data ?? [],
      pagination: {
        total: res.data.meta?.total ?? 0,
        page: res.data.meta?.page ?? 1,
        limit: res.data.meta?.limit ?? 10,
        totalPages: res.data.meta?.totalPages ?? 0,
      },
      meta: res.data.meta,
      message: res.data.message || "Success",
    };
  },

  /**
   * Lấy chi tiết một đơn hàng
   */
  async getOrderById(orderId: string): Promise<OrderResponse> {
    const res = await api.get<ApiResponse<OrderResponse>>(`/orders/${orderId}`);


    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Failed to fetch order");
    }

    return res.data.data ?? ({} as OrderResponse);
  },

  /**
   * Cập nhật trạng thái đơn hàng
   */
  async updateOrderStatus(
    orderId: string,
    status: string,
  ): Promise<OrderResponse> {
    const res = await api.patch<ApiResponse<OrderResponse>>(
      `/orders/${orderId}`,
      {
        status,
      },
    );

    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Failed to update order status");
    }

    return res.data.data ?? ({} as OrderResponse);
  },

  /**
   * Cập nhật trạng thái thanh toán
   */
  async updatePaymentStatus(
    orderId: string,
    paymentStatus: string,
  ): Promise<OrderResponse> {
    const res = await api.patch<ApiResponse<OrderResponse>>(
      `/admin/orders/${orderId}`,
      {
        paymentStatus,
      },
    );

    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Failed to update payment status");
    }

    return res.data.data ?? ({} as OrderResponse);
  },

  /**
   * Khách hàng tự hủy đơn hàng
   */
  async cancelOrder(orderId: string): Promise<OrderResponse> {
    const res = await api.patch<ApiResponse<OrderResponse>>(
      `/orders/${orderId}/cancel`
    );

    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Failed to cancel order");
    }

    return res.data.data ?? ({} as OrderResponse);
  },
};

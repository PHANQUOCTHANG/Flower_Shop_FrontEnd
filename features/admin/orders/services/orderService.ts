/* eslint-disable @typescript-eslint/no-explicit-any */

import api from "@/lib/axios";
import { ApiResponse } from "@/types/response";
import { OrderResponse } from "../types/order";

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

interface OrdersListResponse {
  orders: OrderResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
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
      pagination: (res.data.meta as any) || {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
      message: res.data.message || "Success",
    };
  },

  /**
   * Lấy chi tiết một đơn hàng
   */
  async getOrderById(orderId: string): Promise<OrderResponse> {
    const res = await api.get<ApiResponse<OrderResponse>>(
      `/orders/${orderId}`,
    );

    console.log(res.data.data)

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
};

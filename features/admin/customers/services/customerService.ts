import {
  Customer,
  CustomerListResponse,
} from "@/features/admin/customers/types";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/response";

interface CustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  tier?: string;
}

export const customerService = {
  async getCustomers(params?: CustomersParams) {
    const res = await api.get<ApiResponse<Customer[]>>(
      "/orders/customers/list",
      { params },
    );
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Fetch failed");
    }
    return {
      customers: res.data.data ?? [],
      meta: res.data.meta,
      message: res.data.message,
    };
  },

  async getCustomerById(customerId: string) {
    const res = await api.get<ApiResponse<Customer>>(
      `/customers/${customerId}`,
    );
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Fetch failed");
    }
    return res.data.data;
  },
};

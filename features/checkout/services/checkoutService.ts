import axios from "@/lib/axios";

import { OrderItem, CreateOrderData, Order, CreateOrderResponse } from "@/types/order";

const ORDERS_API = "/orders";

// Helper: Ensure all numeric fields are numbers
const sanitizeOrderData = (data: CreateOrderData): CreateOrderData => {
  return {
    ...data,
    totalPrice:
      typeof data.totalPrice === "string"
        ? parseFloat(data.totalPrice)
        : data.totalPrice,
    items: data.items.map((item) => ({
      ...item,
      price:
        typeof item.price === "string" ? parseFloat(item.price) : item.price,
      quantity:
        typeof item.quantity === "string"
          ? parseInt(item.quantity)
          : item.quantity,
      subtotal:
        typeof item.subtotal === "string"
          ? parseFloat(item.subtotal)
          : item.subtotal,
    })),
  };
};

export const checkoutService = {
  createOrder: async (data: CreateOrderData): Promise<CreateOrderResponse> => {
    try {
      const sanitized = sanitizeOrderData(data);
      const response = await axios.post<CreateOrderResponse>(ORDERS_API, {
        totalPrice: sanitized.totalPrice,
        shippingAddress: sanitized.shippingAddress,
        shippingPhone: sanitized.shippingPhone,
        paymentMethod: sanitized.paymentMethod,
        paymentStatus: sanitized.paymentStatus,
        name: sanitized.name,
        note: sanitized.note,
        items: sanitized.items,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 422) {
        const details = error.response?.data?.details || [];
        const errorMsg = details.length
          ? details.join("\n")
          : error.response?.data?.message || "Dữ liệu không hợp lệ";
        const validationError = new Error(errorMsg);
        validationError.name = "ValidationError";
        throw validationError;
      }
      throw error;
    }
  },

  // Lấy danh sách đơn hàng của user
  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await axios.get<Order[]>(ORDERS_API);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng
  getOrderById: async (orderId: string): Promise<Order> => {
    try {
      const response = await axios.get<Order>(`${ORDERS_API}/${orderId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

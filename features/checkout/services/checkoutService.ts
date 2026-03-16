import axios from "@/lib/axios";

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CreateOrderData {
  totalPrice: number;
  shippingAddress: string;
  shippingPhone: string;
  paymentMethod: "bank" | "wallet" | "cod";
  paymentStatus: "unpaid" | "paid";
  name?: string;
  note?: string;
  items: OrderItem[];
}

export interface Order {
  id: string;
  userId: string;
  totalPrice: number;
  status: string;
  shippingAddress?: string;
  shippingPhone?: string;
  paymentMethod?: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

const ORDERS_API = "/orders";

export const checkoutService = {
  // Tạo đơn hàng mới
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    try {
      const response = await axios.post<Order>(ORDERS_API, {
        totalPrice: data.totalPrice,
        shippingAddress: data.shippingAddress,
        shippingPhone: data.shippingPhone,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus,
        name: data.name,
        note: data.note,
        items: data.items,
      });
      return response.data;
    } catch (error) {
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

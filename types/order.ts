// ─── ADMIN ORDERS ──────────────────────────────────────────────────
export interface OrderItemDetail {
  id: string;
  productId: string;
  productName: string;
  thumbnail: string | null;
  quantity: number;
  price: number;
  subtotal: number;
  slug : string;
}

export interface UserBrief {
  id: string;
  fullName: string;
  email: string;
}

export interface OrderResponse {
  id: string;
  slug : string;
  totalPrice: number;
  status: string;
  name: string | null;
  shippingAddress: string | null;
  shippingPhone: string | null;
  paymentMethod: string | null;
  paymentStatus: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemDetail[];
  user?: UserBrief;
}

export interface OrdersPaginatedResponse {
  data: OrderResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── CHECKOUT & CUSTOMER ORDERS ────────────────────────────────────

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
  name: string;
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

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: {
    jobId?: string;
    status?: string;
    id?: string;
  };
}

/**
 * DTO cho chi tiết từng sản phẩm trong đơn hàng
 */
export interface OrderItemDetail {
  id: string;
  productId: string;
  productName: string;
  thumbnail: string | null;
  quantity: number;
  price: number;
  subtotal: number;
}

/**
 * DTO cho thông tin User rút gọn
 */
export interface UserBrief {
  id: string;
  fullName: string;
  email: string;
}

/**
 * Response DTO cho Order
 */
export interface OrderResponse {
  id: string;
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

/**
 * Dữ liệu phân trang cho danh sách orders
 */
export interface OrdersPaginatedResponse {
  data: OrderResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

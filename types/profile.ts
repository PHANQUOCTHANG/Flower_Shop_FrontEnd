/**
 * Thông tin hồ sơ người dùng
 */
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  avatar?: string;
  tier?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Chi tiết đơn hàng của người dùng
 */
export interface MyOrder {
  id: string;
  totalPrice: number;
  status: "processing" | "shipping" | "completed";
  name: string | null;
  shippingAddress: string | null;
  shippingPhone: string | null;
  paymentMethod: string | null;
  paymentStatus: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Response cho danh sách đơn hàng của chính khách hàng
 */
export interface MyOrdersResponse {
  data: MyOrder[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  meta: any ;
}

/**
 * Request đổi mật khẩu
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Response đổi mật khẩu thành công
 */
export interface ChangePasswordResponse {
  message: string;
  success: boolean;
}

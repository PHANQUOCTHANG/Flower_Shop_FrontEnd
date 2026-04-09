import axios from "@/lib/axios";
import {
  MyOrdersResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "@/features/profile/types/profile";

const ORDERS_API = "/orders";
const AUTH_API = "/auth";

/**
 * Dịch vụ quản lý hồ sơ người dùng
 */
export const profileService = {
  
  // Lấy danh sách đơn hàng của chính khách hàng
  getMyOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    sort?: string;
  }): Promise<MyOrdersResponse> => {
    const response = await axios.get<MyOrdersResponse>(`${ORDERS_API}/me`, {
      params,
    });
    return response.data;
  },

  // Đổi mật khẩu - yêu cầu người dùng đã đăng nhập
  changePassword: async (
    data: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> => {
    const response = await axios.post<ChangePasswordResponse>(
      `${AUTH_API}/change-password`,
      data,
    );
    return response.data;
  },
};

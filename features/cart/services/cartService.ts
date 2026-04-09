import axios from "@/lib/axios";
import { CartResponse } from "@/types/cart";
import { ApiResponse } from "@/types/response";

const CART_API = "/cart";

// Dịch vụ quản lý giỏ hàng - gọi API cart
export const cartService = {
  // Lấy danh sách giỏ hàng từ server
  fetchCart: async (): Promise<ApiResponse<CartResponse>> => {
    const response = await axios.get<ApiResponse<CartResponse>>(CART_API);
    return response.data;
  },

  // Thêm sản phẩm vào giỏ (chỉ gửi productId + quantity)
  addItem: async (productId: string, quantity: number): Promise<void> => {
    await axios.post<void>(`${CART_API}/add`, {
      productId,
      quantity,
    });
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeItem: async (productId: string): Promise<void> => {
    await axios.delete<CartResponse>(`${CART_API}/items/${productId}`);
  },

  // Cập nhật số lượng sản phẩm trong giỏ
  updateQuantity: async (
    productId: string,
    quantity: number,
  ): Promise<void> => {
    await axios.patch<void>(`${CART_API}/update`, { productId, quantity });
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async (): Promise<void> => {
    await axios.delete<CartResponse>(`${CART_API}/clear`);
  },
};

import { Product } from "@/features/product-detail/types";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/response";
import { cartService } from "@/features/cart/services/cartService";

interface ProductDetailParams {
  slug?: string;
  id?: string | number;
}

// Dịch vụ quản lý chi tiết sản phẩm
export const productDetailService = {
  // Lấy thông tin chi tiết sản phẩm từ slug hoặc ID
  async getProductDetail(params?: ProductDetailParams) {
    const slug = params?.slug;
    const id = params?.id;

    if (!slug && !id) {
      throw new Error("Cần slug hoặc ID sản phẩm");
    }

    const url = slug ? `/products/slug/${slug}` : `/products/${id}`;

    const res = await api.get<ApiResponse<Product>>(url);

    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Lỗi khi lấy dữ liệu");
    }

    return {
      product: res.data.data,
      message: res.data.message,
    };
  },

  // Lấy sản phẩm cùng danh mục (sản phẩm liên quan)
  async getRelatedProducts(categorySlug: string, limit: number = 4) {
    try {
      const res = await api.get<ApiResponse<Product[]>>(`/products`, {
        params: {
          category: categorySlug,
          limit: limit + 1, // +1 để loại bỏ sản phẩm hiện tại nếu có
        },
      });

      if (res.data.status !== "success" || !res.data.data) {
        return [];
      }

      return res.data.data.slice(0, limit);
    } catch (error) {
      console.error("Error fetching related products:", error);
      return [];
    }
  },

  // Thêm sản phẩm vào giỏ (chỉ gửi productId + quantity)
  addToCart(productId: string, quantity: number = 1) {
    return cartService.addItem(productId, quantity);
  },
};

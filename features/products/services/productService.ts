import { Product } from "@/features/products/types";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/response";

interface ProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  // Lọc theo giá (Decimal)
  priceMin?: string | number;
  priceMax?: string | number;
  // Lọc theo dịp lễ / danh mục
  occasion?: string;
  categoryId?: string;
  // Lọc theo trạng thái
  status?: "active" | "hidden" | "draft";
  // Lọc sản phẩm có hàng
  inStock?: boolean;
  // Sắp xếp
  sortBy?: "newest" | "price-asc" | "price-desc" | "most-popular";
  // Tìm kiếm theo slug
  slug?: string;
}

export const productService = {
  async getProducts(params?: ProductsParams) {
    const res = await api.get<ApiResponse<Product[]>>("/products", { params });

    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Fetch failed");
    }

    return {
      products: res.data.data ?? [],
      meta: res.data.meta,
      message: res.data.message,
    };
  },
};

import { Product } from "@/features/admin/products/types";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/response";

interface ProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  priceMin?: string | number;
  priceMax?: string | number;
  occasion?: string;
  category?: string;
  status?: "active" | "hidden" | "draft";
  inStock?: boolean;
  sort?: "newest" | "price-asc" | "price-desc" | "most-popular";
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

  async getProductById(productId: string) {
    const res = await api.get<ApiResponse<Product>>(`/products/${productId}`);
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Fetch failed");
    }
    return res.data.data;
  },

  async createProduct(data: FormData | Partial<Product>) {
    const isFormData = data instanceof FormData;
    const res = await api.post<ApiResponse<Product>>("/products", data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Create failed");
    }
    return res.data.data;
  },

  async updateProduct(productId: string, data: FormData | Partial<Product>) {
    const isFormData = data instanceof FormData;
    const res = await api.patch<ApiResponse<Product>>(
      `/products/${productId}`,
      data,
      {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      },
    );
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Update failed");
    }
    return res.data.data;
  },

  async deleteProduct(productId: string) {
    const res = await api.delete<ApiResponse<null>>(`/products/${productId}`);
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Delete failed");
    }
    return res.data;
  },
};
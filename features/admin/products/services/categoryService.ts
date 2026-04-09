import { ProductCategory } from "@/features/products/types";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/response";

interface CategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const categoryService = {
  async getCategories(params?: CategoriesParams) {
    const res = await api.get<ApiResponse<ProductCategory[]>>("/categories", {
      params,
    });
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Fetch failed");
    }
    return {
      categories: res.data.data ?? [],
      meta: res.data.meta,
      message: res.data.message,
    };
  },

  async createCategory(data: FormData | { name: string; slug?: string }) {
    const isFormData = data instanceof FormData;
    const res = await api.post<ApiResponse<ProductCategory>>(
      "/categories",
      data,
      isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
    );
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Create failed");
    }
    return res.data.data;
  },
};

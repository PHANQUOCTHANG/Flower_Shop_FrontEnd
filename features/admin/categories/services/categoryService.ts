import api from "@/lib/axios";
import { ApiResponse } from "@/types/response";
import { AdminCategory, CategoriesParams } from "../types";

export const categoryService = {
  async getCategories(params?: CategoriesParams) {
    const res = await api.get<ApiResponse<AdminCategory[]>>("/categories", {
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

  async createCategory(data: FormData | { name: string; slug?: string; status?: string; sortOrder?: number }) {
    const isFormData = data instanceof FormData;
    const res = await api.post<ApiResponse<AdminCategory>>(
      "/categories",
      data,
      isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
    );
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Create failed");
    }
    return res.data.data;
  },

  async updateCategory(id: string, data: FormData | { name?: string; slug?: string; status?: string; sortOrder?: number }) {
    const isFormData = data instanceof FormData;
    const res = await api.patch<ApiResponse<AdminCategory>>(
      `/categories/${id}`,
      data,
      isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
    );
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Update failed");
    }
    return res.data.data;
  },

  async deleteCategory(id: string) {
    const res = await api.delete<ApiResponse<null>>(`/categories/${id}`);
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Delete failed");
    }
    return true;
  },
};

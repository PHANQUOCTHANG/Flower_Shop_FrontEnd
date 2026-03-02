import { Product } from "@/features/product-detail/types";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/response";

interface ProductDetailParams {
  slug?: string;
  id?: string | number;
}

export const productDetailService = {
  async getProductDetail(params?: ProductDetailParams) {
    const slug = params?.slug;
    const id = params?.id;

    if (!slug && !id) {
      throw new Error("Slug or ID is required");
    }

    const url = slug ? `/products/slug/${slug}` : `/products/${id}`;

    const res = await api.get<ApiResponse<Product>>(url);

    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Fetch failed");
    }

    return {
      product: res.data.data,
      message: res.data.message,
    };
  },
};

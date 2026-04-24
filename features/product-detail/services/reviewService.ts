import api from "@/lib/axios";
import { ReviewsPage } from "@/features/product-detail/types";

interface PaginatedApiResponse<T> {
  status: "success" | "error";
  data: T;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ReviewsParams {
  page?: number;
  limit?: number;
}

// Lấy danh sách đánh giá của sản phẩm theo slug
async function getReviewsBySlug(
  slug: string,
  params: ReviewsParams = {},
): Promise<ReviewsPage> {
  const { data } = await api.get<PaginatedApiResponse<ReviewsPage["data"]>>(
    `/reviews/product/slug/${slug}`,
    { params },
  );

  return {
    data: data.data,
    total: data.meta.total,
    page: data.meta.page,
    limit: data.meta.limit,
  };
}

export const reviewService = { getReviewsBySlug };

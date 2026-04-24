import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/features/product-detail/services/reviewService";
import { ReviewsPage } from "@/features/product-detail/types";

interface UseProductReviewsParams {
  slug: string;
  page?: number;
  limit?: number;
}

export const useProductReviews = ({ slug, page = 1, limit = 10 }: UseProductReviewsParams) => {
  return useQuery<ReviewsPage>({
    queryKey: ["product-reviews", slug, page, limit],
    queryFn: () => reviewService.getReviewsBySlug(slug, { page, limit }),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 phút
    placeholderData: (prev) => prev,
  });
};

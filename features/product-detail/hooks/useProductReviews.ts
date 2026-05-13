import { useInfiniteQuery } from "@tanstack/react-query";
import { reviewService } from "@/features/product-detail/services/reviewService";
import { ReviewsPage } from "@/features/product-detail/types";

const REVIEWS_LIMIT = 5;

interface UseProductReviewsParams {
  slug: string;
  page? : number;
  limit? : number;
}

export const useProductReviews = ({ slug }: UseProductReviewsParams) => {
  return useInfiniteQuery<ReviewsPage>({
    queryKey: ["product-reviews-infinite", slug],
    queryFn: ({ pageParam }) =>
      reviewService.getReviewsBySlug(slug, {
        page: pageParam as number,
        limit: REVIEWS_LIMIT,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / REVIEWS_LIMIT);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 phút
  });
};
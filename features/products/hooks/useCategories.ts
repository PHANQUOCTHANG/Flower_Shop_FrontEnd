import { categoryService } from "@/features/products/services/categoryService";
import { useQuery } from "@tanstack/react-query";

interface UseCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const useCategories = (params?: UseCategoriesParams) => {
  const query = useQuery({
    queryKey: ["categories", "list", params],
    queryFn: () => categoryService.getCategories(params),
    placeholderData: (prev) => prev,
    staleTime: 300_000, // 5 phút — category rất ít thay đổi
  });

  return {
    categories: query.data?.categories ?? [],
    meta: query.data?.meta,
    loading: query.isPending,
    fetching: query.isFetching,
    error: query.error ?? null,
    isEmpty: !query.isPending && (query.data?.categories?.length ?? 0) === 0,
    refetch: query.refetch,
  };
};

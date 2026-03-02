import { categoryService } from "@/features/products/services/categoryService";
import { useQuery } from "@tanstack/react-query";

export const useCategories = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const query = useQuery({
    queryKey: ["categories", params],
    queryFn: () => categoryService.getCategories(params),
    placeholderData: (previousData) => previousData,
  });

  return {
    categories: query.data?.categories ?? [],
    meta: query.data?.meta,
    loading: query.isPending,
    fetching: query.isFetching,
    error: query.error ?? null,
    empty: !query.isPending && (query.data?.categories?.length ?? 0) === 0,
    refetch: query.refetch,
  };
};

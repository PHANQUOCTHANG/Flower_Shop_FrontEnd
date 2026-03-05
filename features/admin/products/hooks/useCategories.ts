import { categoryService } from "@/features/admin/products/services/categoryService";
import { CategoryItem } from "@/features/admin/products/types";
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

  const categories = query.data?.categories ?? [];

  const newCategories: CategoryItem[] = categories?.map((item) => {
    return {
      id: Number(item.id),
      name: item.name,
      slug: item.slug,
    };
  });

  return {
    categories: newCategories,
    meta: query.data?.meta,
    loading: query.isPending,
    fetching: query.isFetching,
    error: query.error ?? null,
    empty: !query.isPending && (query.data?.categories?.length ?? 0) === 0,
    refetch: query.refetch,
  };
};

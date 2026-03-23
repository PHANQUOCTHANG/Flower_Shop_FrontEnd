import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/features/admin/products/services/categoryService";
import { CategoryItem } from "@/features/admin/products/types";

// ─── Query keys ───────────────────────────────────────────────────────────────
const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (params?: object) => [...categoryKeys.lists(), params] as const,
};

// ─── useCategories ────────────────────────────────────────────────────────────
export const useCategories = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const query = useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoryService.getCategories(params),
    placeholderData: (prev) => prev,
    staleTime: 300_000, // 5 phút — category rất ít thay đổi
  });

  const categories: CategoryItem[] = (query.data?.categories ?? []).map(
    (item) => ({
      id: Number(item.id),
      name: item.name,
      slug: item.slug,
    }),
  );

  return {
    categories,
    meta: query.data?.meta,
    loading: query.isPending,
    fetching: query.isFetching,
    error: query.error ?? null,
    isEmpty: !query.isPending && (query.data?.categories?.length ?? 0) === 0,
    refetch: query.refetch,
  };
};

// ─── useCreateCategory ────────────────────────────────────────────────────────
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error, reset } = useMutation(
    {
      mutationFn: (data: { name: string; slug?: string }) =>
        categoryService.createCategory(data),

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      },
    },
  );

  return {
    createCategory: mutate,
    createCategoryAsync: mutateAsync,
    isPending,
    isError,
    error: error as Error | null,
    reset,
  };
};
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/features/admin/products/services/categoryService";

// Query keys
const categoryKeys = {
  all: ["admin", "categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (params?: object) => [...categoryKeys.lists(), params] as const,
};

// Hook lấy danh sách danh mục
interface UseCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const useCategories = (params?: UseCategoriesParams) => {
  const query = useQuery({
    queryKey: [categoryKeys.all[0], categoryKeys.all[1], "list", params], // ["categories", "list", params]
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

// Hook tạo danh mục mới
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error, reset } = useMutation(
    {
      mutationFn: (data: FormData | { name: string; slug?: string }) =>
        categoryService.createCategory(data),

      onSuccess: () => {
        // Invalidate tất cả category queries để refetch
        queryClient.invalidateQueries({
          queryKey: [categoryKeys.all[0], categoryKeys.all[1], "list"],
        });
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

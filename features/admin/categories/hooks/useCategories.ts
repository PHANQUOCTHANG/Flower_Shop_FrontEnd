import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../services/categoryService";
import { CategoriesParams } from "../types";

// Query keys
export const categoryKeys = {
  all: ["admin", "categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (params?: object) => [...categoryKeys.lists(), params] as const,
};

// Hook lấy danh sách danh mục
export const useCategories = (params?: CategoriesParams) => {
  const query = useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoryService.getCategories(params),
    placeholderData: (prev) => prev,
    staleTime: 300_000, // 5 phút
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

  return useMutation({
    mutationFn: (data: FormData | { name: string; slug?: string; status?: string; sortOrder?: number }) =>
      categoryService.createCategory(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.lists(),
      });
    },
  });
};

// Hook cập nhật danh mục
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData | { name?: string; slug?: string; status?: string; sortOrder?: number } }) =>
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.lists(),
      });
    },
  });
};

// Hook xoá danh mục
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.lists(),
      });
    },
  });
};

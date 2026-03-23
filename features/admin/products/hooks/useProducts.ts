/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/features/admin/products/services/productService";
import { Product } from "@/features/admin/products/types";

// ─── Query keys ───────────────────────────────────────────────────────────────
const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params?: object) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// ─── Params type ──────────────────────────────────────────────────────────────
interface UseProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  priceMin?: number | null;
  priceMax?: number | null;
  category?: string;
  sort?: string;
}

// ─── useProducts ──────────────────────────────────────────────────────────────
export const useProducts = (params?: UseProductsParams) => {
  const query = useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => {
      // Loại bỏ các giá trị null/undefined trước khi gọi API
      const apiParams = Object.fromEntries(
        Object.entries({
          page: params?.page,
          limit: params?.limit,
          search: params?.search || undefined,
          priceMin: params?.priceMin ?? undefined,
          priceMax: params?.priceMax ?? undefined,
          category: params?.category || undefined,
          sort: params?.sort || undefined,
        }).filter(([, v]) => v !== undefined),
      );
      return productService.getProducts(apiParams);
    },
    placeholderData: (prev) => prev,
    staleTime: 30_000, // 30 giây — product list không cần real-time
  });

  return {
    products: query.data?.products ?? [],
    meta: query.data?.meta,
    totalPages: (query.data?.meta as any)?.totalPages ?? 1,
    loading: query.isPending,
    fetching: query.isFetching,
    error: query.error ?? null,
    isEmpty: !query.isPending && (query.data?.products?.length ?? 0) === 0,
    refetch: query.refetch,
  };
};

// ─── useCreateProduct ─────────────────────────────────────────────────────────
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error, reset } = useMutation(
    {
      mutationFn: (data: FormData | Partial<Product>) =>
        productService.createProduct(data),

      onSuccess: () => {
        // Invalidate toàn bộ list để fetch lại trang 1 với data mới nhất
        queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      },
    },
  );

  return {
    createProduct: mutate,
    createProductAsync: mutateAsync,
    isPending,
    isError,
    error: error as Error | null,
    reset,
  };
};

// ─── useUpdateProduct ─────────────────────────────────────────────────────────
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: FormData | Partial<Product>;
    }) => productService.updateProduct(productId, data),

    // Optimistic update cho detail cache
    onMutate: async ({ productId, data }) => {
      await queryClient.cancelQueries({
        queryKey: productKeys.detail(productId),
      });

      const previousDetail = queryClient.getQueryData(
        productKeys.detail(productId),
      );

      queryClient.setQueryData(
        productKeys.detail(productId),
        (old: any) => old && { ...old, ...data },
      );

      return { previousDetail };
    },

    onError: (_err, { productId }, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(
          productKeys.detail(productId),
          context.previousDetail,
        );
      }
    },

    onSettled: (_data, _err, { productId }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
    },
  });

  return {
    updateProduct: mutate,
    updateProductAsync: mutateAsync,
    isPending,
    isError,
    error: error as Error | null,
  };
};

// ─── useDeleteProduct ─────────────────────────────────────────────────────────
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: (productId: string) => productService.deleteProduct(productId),

    // Optimistic: xoá khỏi list ngay lập tức
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: productKeys.lists() });

      const previousLists = queryClient.getQueriesData({
        queryKey: productKeys.lists(),
      });

      queryClient.setQueriesData(
        { queryKey: productKeys.lists() },
        (old: any) => {
          if (!old?.products) return old;
          return {
            ...old,
            products: old.products.filter((p: Product) => p.id !== productId),
            meta: old.meta
              ? { ...old.meta, total: (old.meta.total ?? 1) - 1 }
              : old.meta,
          };
        },
      );

      return { previousLists };
    },

    onError: (_err, _id, context) => {
      context?.previousLists?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });

  return {
    deleteProduct: mutate,
    deleteProductAsync: mutateAsync,
    isPending,
    isError,
    error: error as Error | null,
  };
};
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/features/admin/products/services/productService";
import { type CreateProductDto } from "@/types";
import { Product } from "@/types/product";

// Query keys
const productKeys = {
  all: ["admin", "products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params?: object) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  bySlug: (slug: string) => ["product", "slug", slug] as const,
};

// Params kiểu dữ liệu
interface UseProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  priceMin?: number | null;
  priceMax?: number | null;
  category?: string;
  sort?: string;
  status?: string;
}

// Hook lấy danh sách sản phẩm
export const useProducts = (params?: UseProductsParams) => {
  const query = useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => {
      const apiParams = Object.fromEntries(
        Object.entries({
          page: params?.page,
          limit: params?.limit,
          search: params?.search || undefined,
          priceMin: params?.priceMin ?? undefined,
          priceMax: params?.priceMax ?? undefined,
          category: params?.category || undefined,
          sort: params?.sort || undefined,
          status: params?.status || undefined,
        }).filter(([, v]) => v !== undefined),
      );
      return productService.getProducts(apiParams);
    },
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });


  return {
    products: query.data?.products ?? [],
    meta: query.data?.meta,
    totalPages: query.data?.meta?.totalPages ?? 1,
    loading: query.isPending,
    fetching: query.isFetching,
    error: query.error ?? null,
    isEmpty: !query.isPending && (query.data?.products?.length ?? 0) === 0,
    refetch: query.refetch,
  };
};

// Hook lấy sản phẩm theo slug
export const useProductBySlug = (slug?: string) => {
  const query = useQuery({
    queryKey: slug ? productKeys.bySlug(slug) : ["product"],
    queryFn: () => {
      if (!slug) throw new Error("Slug is required");
      return productService.getProductBySLug(slug);
    },
    enabled: !!slug,
    staleTime: 30_000,
  });

  return {
    product: query.data ?? null,
    loading: query.isPending,
    fetching: query.isFetching,
    error: query.error ?? null,
    refetch: query.refetch,
  };
};

// Hook tạo sản phẩm mới
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error, reset } = useMutation(
    {
      // Nhận thẳng CreateProductDto — service tự build FormData nếu cần
      mutationFn: (data: CreateProductDto) =>
        productService.createProduct(data),

      onSuccess: () => {
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

// Hook cập nhật sản phẩm
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: ({
      productId,
      data,
      slug,
    }: {
      productId: string;
      data: FormData | Partial<Product>;
      slug?: string;
    }) => productService.updateProduct(productId, data),

    onMutate: async ({ productId, data }) => {
      // Only do optimistic update if data is not FormData (can't spread FormData)
      if (!(data instanceof FormData)) {
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
      }
      return { previousDetail: null };
    },

    onError: (_err, { productId }, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(
          productKeys.detail(productId),
          context.previousDetail,
        );
      }
    },

    onSettled: (_data, _err, { productId, slug }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });
      // Invalidate slug-based query if slug is provided
      if (slug) {
        queryClient.invalidateQueries({
          queryKey: productKeys.bySlug(slug),
        });
      } else {
        // If no slug provided, invalidate all slug-based queries
        queryClient.invalidateQueries({
          queryKey: ["product", "slug"],
        });
      }
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

// Hook xóa sản phẩm
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: (productId: string) => productService.deleteProduct(productId),

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

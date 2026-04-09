/* eslint-disable @typescript-eslint/no-explicit-any */
import { productService } from "@/features/products/services/productService";
import { useQuery } from "@tanstack/react-query";

interface UseProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  priceMin?: number | null;
  priceMax?: number | null;
  category?: string;
  sort?: string;
}

export const useProducts = (params?: UseProductsParams) => {
  const query = useQuery({
    queryKey: ["products", "list", params],
    queryFn: () => {
      // Loại bỏ null/undefined trước khi gọi API
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
    placeholderData: (prev) => prev, // giữ data cũ khi đổi filter/trang → không bị flash trắng
    staleTime: 30_000,               // 30 giây — tránh refetch liên tục khi user navigate
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
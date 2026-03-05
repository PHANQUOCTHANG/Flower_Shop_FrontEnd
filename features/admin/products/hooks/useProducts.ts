/* eslint-disable @typescript-eslint/no-explicit-any */


import { productService } from "@/features/admin/products/services/productService";
import { useQuery } from "@tanstack/react-query";

export const useProducts = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  priceMin?: number | null;
  priceMax?: number | null;
  category?: string;
  sort?: string;
}) => {
  const query = useQuery({
    queryKey: ["products", params],
    queryFn: () => {
      const apiParams: any = {
        page: params?.page,
        limit: params?.limit,
        search: params?.search,
      };

      if (params?.priceMin !== null && params?.priceMin !== undefined) {
        apiParams.priceMin = params.priceMin;
      }
      if (params?.priceMax !== null && params?.priceMax !== undefined) {
        apiParams.priceMax = params.priceMax;
      }
      if (params?.category) {
        apiParams.category = params.category;
      }
      if (params?.sort) {
        apiParams.sort = params.sort;
      }

      return productService.getProducts(apiParams);
    },

    // Thay cho keepPreviousData
    placeholderData: (previousData) => previousData,
  });

  return {
    products: query.data?.products ?? [],
    meta: query.data?.meta,
    totalPages: (query.data?.meta as any)?.totalPages ?? 1,
    loading: query.isPending, // v5 đổi từ isLoading
    fetching: query.isFetching,
    error: query.error ?? null,
    empty: !query.isPending && (query.data?.products?.length ?? 0) === 0,
    refetch: query.refetch,
  };
};

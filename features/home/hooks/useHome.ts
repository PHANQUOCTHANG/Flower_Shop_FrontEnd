"use client";

import { useQuery } from "@tanstack/react-query";
import { productService } from "@/features/products/services/productService";
import { categoryService } from "@/features/products/services/categoryService";

export interface HomeCategoryGroup {
  category: {
    id: string;
    name: string;
    slug: string;
  };
  products: any[];
  loading: boolean;
  isEmpty: boolean;
}

export const useHome = () => {
  const limit = 20;

  // Lấy categories dùng riêng cho danh mục top (vì API trả categories theo group chỉ lấy những mục có sản phẩm)
  const categoryQuery = useQuery({
    queryKey: ["categories", "list"],
    queryFn: () => categoryService.getCategories(),
    staleTime: 300_000, // 5 phút
    placeholderData: (prev) => prev,
  });

  const categories = categoryQuery.data?.categories ?? [];

  // Lấy sản phẩm kết hợp danh mục (1 call API duy nhất)
  const groupedQuery = useQuery({
    queryKey: ["products", "grouped", limit],
    queryFn: () => productService.getProductsGroupedByCategory(limit),
    staleTime: 60_000, 
  });

  const groupedData = (groupedQuery.data || []) as any[];
  
  // Format lại data đúng cấu trúc UI đang chờ
  const productsByCategory: HomeCategoryGroup[] = groupedData.map((group) => ({
    category: group.category,
    products: group.products,
    loading: false,
    isEmpty: group.products.length === 0,
  }));

  return {
    categories,
    categoriesLoading: categoryQuery.isPending,
    productsByCategory,
    loading: categoryQuery.isPending || groupedQuery.isPending,
    fetching: categoryQuery.isFetching || groupedQuery.isFetching,
  };
};
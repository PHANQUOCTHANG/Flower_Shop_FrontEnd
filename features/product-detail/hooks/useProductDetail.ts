import { productDetailService } from "@/features/product-detail/services/productDetailService";
import { useQuery } from "@tanstack/react-query";
import { useAddToCart } from "@/features/cart/hooks";

export const useProductDetail = (params?: { slug?: string; id?: string }) => {
  // Query lấy chi tiết sản phẩm
  const productQuery = useQuery({
    queryKey: ["product-detail", params],
    queryFn: () => productDetailService.getProductDetail(params),
    enabled: !!(params?.slug || params?.id),
    placeholderData: (previousData) => previousData,
  });

  // Query lấy sản phẩm cùng danh mục
  const relatedProductsQuery = useQuery({
    queryKey: ["related-products", productQuery.data?.product?.categories[0]?.slug],
    queryFn: () =>
      productDetailService.getRelatedProducts(
        productQuery.data?.product?.categories[0]?.slug || "",
        4,
      ),
    enabled: !!productQuery.data?.product?.categories[0]?.slug,
  });

  // Mutation thêm vào giỏ hàng
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  const handleAddToCart = (quantity: number = 1) => {
    const product = productQuery.data?.product;
    if (!product) return;

    const productId = product.id || product.slug || "";
    if (!productId) return;

    addToCart({ productId, quantity });
  };

  // Loại bỏ chính sản phẩm đang xem khỏi danh sách liên quan
  const relatedProducts = relatedProductsQuery.data?.filter(
    (item) => item.slug !== params?.slug,
  );

  return {
    product: productQuery.data?.product,
    similarProducts: relatedProducts || [],
    loading: productQuery.isPending,
    fetching: productQuery.isFetching,
    relatedLoading: relatedProductsQuery.isPending,
    error: productQuery.error ?? null,
    refetch: productQuery.refetch,
    addToCart: handleAddToCart,
    isAddingToCart,
  };
};

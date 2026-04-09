import { productDetailService } from "@/features/product-detail/services/productDetailService";
import { useQuery } from "@tanstack/react-query";
import { Review } from "@/features/product-detail/types";
import { useAddToCart } from "@/features/cart/hooks";

// Dữ liệu mẫu đánh giá sản phẩm
const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    user: "Nguyễn Văn An",
    rating: 5,
    date: "15/05/2024",
    comment: "Hoa rất tươi và đẹp y như hình. Giao hàng nhanh đúng hẹn 2h.",
  },
  {
    id: 2,
    user: "Trần Thị Bình",
    rating: 4,
    date: "10/05/2024",
    comment: "Hoa nở rất thơm, gói quà cẩn thận. Sẽ ủng hộ shop tiếp.",
  },
  {
    id: 3,
    user: "Lê Minh Tâm",
    rating: 5,
    date: "02/05/2024",
    comment: "Dịch vụ tuyệt vời, nhân viên tư vấn rất nhiệt tình.",
  },
];

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
    queryKey: [
      "related-products",
      productQuery.data?.product?.categories[0]?.slug,
    ],
    queryFn: () =>
      productDetailService.getRelatedProducts(
        productQuery.data?.product?.categories[0]?.slug || "",
        4,
      ),
    enabled: !!productQuery.data?.product?.categories[0]?.slug,
  });

  // Mutation thêm vào giỏ hàng
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  // Xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (quantity: number = 1) => {
    if (!productQuery.data?.product) {
      console.error("Sản phẩm chưa được tải");
      return;
    }

    const product = productQuery.data.product;
    const productId = product.id || product.slug || "";

    if (!productId) {
      console.error("Cần ID sản phẩm");
      return;
    }

    // Thêm vào giỏ hàng với productId + quantity
    addToCart({ productId, quantity });
  };

  // lấy relatedProduct nhưng không lấy chính nó . 
  const relatedProducts = relatedProductsQuery.data?.filter(item => item.slug !== params?.slug)

  return {
    product: productQuery.data?.product,
    reviews: MOCK_REVIEWS,
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

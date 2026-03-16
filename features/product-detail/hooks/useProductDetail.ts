import { productDetailService } from "@/features/product-detail/services/productDetailService";
import { useQuery } from "@tanstack/react-query";
import { SimilarProduct, Review } from "@/features/product-detail/types";
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

// Dữ liệu mẫu sản phẩm tương tự
const MOCK_SIMILAR_PRODUCTS: SimilarProduct[] = [
  {
    id: "1",
    name: "Pink Dream Roses",
    slug: "pink-dream-roses",
    price: 720000,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=400&auto=format&fit=crop",
    images: [],
  },
  {
    id: "2",
    name: "Sunset Glow Tulips",
    slug: "sunset-glow-tulips",
    price: 950000,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    images: [],
  },
  {
    id: "3",
    name: "Lavender Mist",
    slug: "lavender-mist",
    price: 680000,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1565011523534-747a8601f10a?q=80&w=400&auto=format&fit=crop",
    images: [],
  },
  {
    id: "4",
    name: "Golden Sunshine",
    slug: "golden-sunshine",
    price: 550000,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1597848212624-a19eb3bf63a7?q=80&w=400&auto=format&fit=crop",
    images: [],
  },
];

export const useProductDetail = (params?: { slug?: string; id?: string }) => {
  const query = useQuery({
    queryKey: ["product-detail", params],
    queryFn: () => productDetailService.getProductDetail(params),
    enabled: !!(params?.slug || params?.id),
    placeholderData: (previousData) => previousData,
  });

  // Mutation thêm vào giỏ hàng
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  // Xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (quantity: number = 1) => {
    if (!query.data?.product) {
      console.error("Sản phẩm chưa được tải");
      return;
    }

    const product = query.data.product;
    const productId = product.id || product.slug || "";

    if (!productId) {
      console.error("Cần ID sản phẩm");
      return;
    }

    console.log({ productId, quantity });

    // Thêm vào giỏ hàng với productId + quantity
    addToCart({ productId, quantity });
  };

  return {
    product: query.data?.product,
    reviews: MOCK_REVIEWS,
    similarProducts: MOCK_SIMILAR_PRODUCTS,
    loading: query.isPending,
    fetching: query.isFetching,
    error: query.error ?? null,
    refetch: query.refetch,
    addToCart: handleAddToCart,
    isAddingToCart,
  };
};

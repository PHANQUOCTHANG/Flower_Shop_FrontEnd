import { Product, SimilarProduct, Review } from "../types";

export const useProductDetail = () => {
  const PRODUCT_DATA: Product = {
    id: "lily-01",
    name: "Pure Elegance White Lilies",
    price: 850000,
    description:
      "Hoa ly trắng kết hợp cùng hơi thở của em bé (baby's breath) cho vẻ đẹp cổ điển, sang trọng và tinh tế.",
    images: [
      "https://images.unsplash.com/photo-1599021456807-25db0f970724?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563241527-3004b7be0fab?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1525286100320-951bc6e5ad61?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591886861403-107074e6f47f?q=80&w=800&auto=format&fit=crop",
    ],
    composition: [
      "5 cành Ly trắng Đà Lạt",
      "Hoa Baby trắng nhập khẩu",
      "Lá bạc trang trí",
      "Giấy gói cao cấp",
    ],
    meaning: "Biểu tượng của sự tinh khiết, đức hạnh và khởi đầu mới tốt đẹp.",
    occasions: ["Sinh nhật", "Kỷ niệm", "Chúc mừng", "Khai trương"],
  };

  const SIMILAR_PRODUCTS: SimilarProduct[] = [
    {
      id: "1",
      name: "Pink Dream Roses",
      price: 720000,
      image:
        "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "2",
      name: "Sunset Glow Tulips",
      price: 950000,
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "3",
      name: "Lavender Mist",
      price: 680000,
      image:
        "https://images.unsplash.com/photo-1565011523534-747a8601f10a?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "4",
      name: "Golden Sunshine",
      price: 550000,
      image:
        "https://images.unsplash.com/photo-1597848212624-a19eb3bf63a7?q=80&w=400&auto=format&fit=crop",
    },
  ];

  const REVIEWS: Review[] = [
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
      comment: "Ly nở rất thơm, gói quà cẩn thận. Sẽ ủng hộ shop tiếp.",
    },
    {
      id: 3,
      user: "Lê Minh Tâm",
      rating: 5,
      date: "02/05/2024",
      comment: "Dịch vụ tuyệt vời, nhân viên tư vấn rất nhiệt tình.",
    },
  ];

  return {
    PRODUCT_DATA,
    SIMILAR_PRODUCTS,
    REVIEWS,
  };
};

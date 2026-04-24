export * from "@/types/product";

// Kiểu dữ liệu review trả về từ API (khớp với ReviewResponseDto backend)
export interface ProductReviewMedia {
  url: string;
  type: "image" | "video";
}

export interface ProductReview {
  id: string;
  rating: number;
  content: string | null;
  createdAt: string;
  user: {
    fullName: string;
    avatar: string | null;
  };
  media: ProductReviewMedia[];
}

// Kiểu phân trang cho review
export interface ReviewsPage {
  data: ProductReview[];
  total: number;
  page: number;
  limit: number;
}

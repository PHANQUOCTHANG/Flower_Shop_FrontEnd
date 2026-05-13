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

// Thống kê rating từ backend (tính trên toàn bộ reviews, không phụ thuộc trang)
export interface ReviewStats {
  avgRating: number;
  starCounts: { star: number; count: number }[];
}

// Kiểu phân trang cho review
export interface ReviewsPage {
  data: ProductReview[];
  total: number;
  page: number;
  limit: number;
  stats: ReviewStats;
}

// Review types — dùng cho hiển thị danh sách đánh giá

export interface ReviewMedia {
  url: string;
  type: "image" | "video";
}

export interface ReviewResponse {
  id: string;
  rating: number;
  content?: string;
  media: ReviewMedia[];
  isVisible: boolean;
  createdAt: string;
  user: {
    fullName: string;
    avatar: string | null;
  };
}

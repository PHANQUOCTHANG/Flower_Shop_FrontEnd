// Sản phẩm chi tiết
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  composition: string[];
  meaning: string;
  occasions: string[];
}

// Sản phẩm tương tự
export interface SimilarProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

// Đánh giá
export interface Review {
  id: number;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

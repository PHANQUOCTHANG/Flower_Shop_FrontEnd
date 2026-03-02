// Sản phẩm chi tiết
export interface Product {
  id: string | number;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  price: string | number;
  comparePrice?: string | number | null;
  costPrice?: string | number | null;
  sku?: string;
  stockQuantity: number;
  lowStockThreshold?: number;
  thumbnailUrl?: string | null;
  metaTitle?: string;
  metaDescription?: string;
  status: string;
  images: ProductImage[];
  composition?: string[];
  meaning?: string;
  occasions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Hình ảnh sản phẩm
export interface ProductImage {
  id: string | number;
  url: string;
  isPrimary?: boolean;
}

// Sản phẩm tương tự
export interface SimilarProduct {
  id: string | number;
  name: string;
  price: string | number;
  image: string;
  slug?: string;
}

// Đánh giá
export interface Review {
  id: number | string;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

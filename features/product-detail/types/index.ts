// Hình ảnh sản phẩm
export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

// Danh mục sản phẩm
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

// Sản phẩm chi tiết - Khớp với ProductResponseDto từ backend
export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  price: number;
  comparePrice: number | null;
  costPrice: number | null;
  sku: string | null;
  stockQuantity: number;
  lowStockThreshold: number | null;
  thumbnailUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  images: ProductImage[];
  categories: ProductCategory[];
}

// Sản phẩm tương tự - Khớp với ProductResponseDto từ backend
export interface SimilarProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  thumbnailUrl: string | null;
  images: ProductImage[];
}

// Đánh giá
export interface Review {
  id: number | string;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

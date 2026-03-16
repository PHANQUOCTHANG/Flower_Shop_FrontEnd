export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

// Khớp với ProductResponseDto từ backend
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

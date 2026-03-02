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

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  price: string | number;
  comparePrice: string | number | null;
  stockQuantity: number;
  lowStockThreshold?: number;
  thumbnailUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  categories: ProductCategory[];
}

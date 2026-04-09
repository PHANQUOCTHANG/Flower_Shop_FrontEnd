// ─── Hình ảnh và Danh mục ──────────────────────────────────────────

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl?: string | null;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

// ─── Sản phẩm chính ───────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  price: number;
  comparePrice: number | null;
  costPrice?: number | null;
  sku: string | null;
  stockQuantity: number;
  lowStockThreshold?: number | null;
  thumbnailUrl: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  images: ProductImage[];
  categories: ProductCategory[];
}

// ─── UI & Hiển thị ───────────────────────────────────────────────

export interface SimilarProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  thumbnailUrl: string | null;
  images: ProductImage[];
}

export interface Review {
  id: number | string;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

export type ViewMode = "grid" | "list";

export const PRODUCTS_CONFIG = {
  ITEMS_PER_PAGE: 6,
  CATEGORIES_LIMIT: 6,
  DEFAULT_VIEW: "grid" as const,
  DEFAULT_SORT: "newest" as const,
  ROUTE: "/products" as const,
} as const;

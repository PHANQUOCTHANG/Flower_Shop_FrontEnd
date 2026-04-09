export interface CreateProductDto {
  name: string;
  shortDescription?: string;
  description?: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  thumbnailUrl?: string;
  status: "active" | "hidden" | "draft";
  categoryIds?: string[];
  images?: Array<{
    imageUrl: string;
    isPrimary: boolean;
    sortOrder: number;
  }>;
}

export interface CreateProductSchema {
  name: string;
  shortDescription?: string;
  description?: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  status: "active" | "hidden" | "draft";
  categoryIds?: string[];
}

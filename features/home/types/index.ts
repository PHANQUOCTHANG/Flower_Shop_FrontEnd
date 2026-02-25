// --- Types & Interfaces ---
export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  badgeType?: "discount" | "new" | "hot";
}

export interface Category {
  id: number;
  name: string;
  count: string;
  image: string;
}

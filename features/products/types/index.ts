// --- Types ---
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  badge?: string;
  badgeType?: "hot" | "new";
}
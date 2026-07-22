import api from "@/lib/axios";
import { Product } from "@/features/products/types";

export const wishlistService = {
  getWishlistIds: async () => {
    const res = await api.get("/wishlist/ids");
    return res.data.data as string[];
  },

  getWishlist: async (page = 1, limit = 8) => {
    const res = await api.get<{
      data: Product[];
      meta: { total: number; page: number; limit: number; totalPages: number };
    }>("/wishlist", { params: { page, limit } });
    return res.data;
  },

  toggleWishlist: async (productId: string) => {
    const res = await api.post("/wishlist/toggle", { productId });
    return res.data.data as { added: boolean };
  },
};

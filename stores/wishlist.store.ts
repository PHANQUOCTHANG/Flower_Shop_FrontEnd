import { create } from "zustand";

interface WishlistState {
  wishlistIds: string[]; // Dùng string[] thay vì Set — serializable, persist-safe
  count: number;
  setIds: (ids: string[]) => void;
  toggle: (productId: string, added: boolean) => void;
  isInWishlist: (productId: string) => boolean; // Thay thế .has()
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  wishlistIds: [],
  count: 0,

  setIds: (ids: string[]) => {
    // Dùng Set tạm thời để loại trùng, lưu về string[]
    const unique = [...new Set(ids)];
    set({ wishlistIds: unique, count: unique.length });
  },

  toggle: (productId: string, added: boolean) => {
    set((state) => {
      const newIds = added
        ? [...new Set([...state.wishlistIds, productId])] // thêm, không trùng
        : state.wishlistIds.filter((id) => id !== productId);
      return { wishlistIds: newIds, count: newIds.length };
    });
  },

  // Thay thế wishlistIds.has(id) — an toàn với JSON.stringify
  isInWishlist: (productId: string) => get().wishlistIds.includes(productId),

  clear: () => set({ wishlistIds: [], count: 0 }),
}));

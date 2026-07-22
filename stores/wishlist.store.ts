import { create } from "zustand";

interface WishlistState {
  wishlistIds: Set<string>;
  count: number;
  setIds: (ids: string[]) => void;
  toggle: (productId: string, added: boolean) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  wishlistIds: new Set<string>(),
  count: 0,

  setIds: (ids: string[]) => {
    set({
      wishlistIds: new Set(ids),
      count: ids.length,
    });
  },

  toggle: (productId: string, added: boolean) => {
    set((state) => {
      const newIds = new Set(state.wishlistIds);
      if (added) {
        newIds.add(productId);
      } else {
        newIds.delete(productId);
      }
      return {
        wishlistIds: newIds,
        count: newIds.size,
      };
    });
  },

  clear: () => {
    set({
      wishlistIds: new Set<string>(),
      count: 0,
    });
  },
}));

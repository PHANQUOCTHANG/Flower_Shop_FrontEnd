"use client";

import { CartItemResponse } from "@/features/cart/types/cart";
import { create } from "zustand";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CartStoreState {
  items: CartItemResponse[];
  isLoading: boolean;
  error: string | null;
}

interface CartStoreActions {
  setItems: (items: CartItemResponse[]) => void;
  addItem: (item: CartItemResponse) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export type CartStore = CartStoreState & CartStoreActions;

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  setItems: (items) => set({ items }),

  addItem: (item) => {
    set((state) => {
      // FIX: So sánh bằng product.id thay vì item.id (cart item id).
      // item.id là id của cart record, trùng nhau khi server tạo mới.
      // product.id mới là định danh thực sự của sản phẩm.
      const existingItem = state.items.find(
        (i) => i.product.id === item.product.id,
      );

      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.product.id === item.product.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          ),
        };
      }

      return { items: [...state.items, item] };
    });
  },

  removeItem: (productId) => {
    // FIX: Đồng bộ tên param và logic filter với cách dùng ở useCartHooks
    // (truyền vào product.id chứ không phải cart item id)
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    set((state) => ({
      // FIX: Đổi sang so sánh bằng product.id để nhất quán với removeItem và addItem
      items: state.items.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  // FIX: Đổi từ ?. sang || [] để đảm bảo luôn có array fallback.
  // items được khởi tạo là [] nên ?. không cần thiết,
  // nhưng || [] bảo vệ trường hợp setItems được gọi với undefined từ bên ngoài.
  getTotal: () =>
    (get().items || []).reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    ),

  getItemCount: () =>
    (get().items || []).reduce((acc, item) => acc + item.quantity, 0),
}));

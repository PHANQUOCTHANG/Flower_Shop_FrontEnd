"use client";

import { CartItemResponse } from "@/features/cart/types/cart";
import { create } from "zustand";

interface CartStoreState {
  items: CartItemResponse[];
  isLoading: boolean;
  error: string | null;
}

interface CartStoreActions {
  setItems: (items: CartItemResponse[]) => void;
  addItem: (item: CartItemResponse) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export type CartStore = CartStoreState & CartStoreActions;

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  setItems: (items: CartItemResponse[]) => {
    set({ items });
  },

  addItem: (item: CartItemResponse) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);

      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          ),
        };
      }

      return { items: [...state.items, item] };
    });
  },

  removeItem: (id: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  updateQuantity: (id: string, quantity: number) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  getTotal: () => {
    return get().items?.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );
  },

  getItemCount: () => {
    return get().items?.reduce((acc, item) => acc + item.quantity, 0);
  },
}));

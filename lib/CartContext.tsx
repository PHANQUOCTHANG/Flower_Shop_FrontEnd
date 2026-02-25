"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Bó hồng Red Charm",
      price: 500000,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1548610762-656363650a21?q=80&w=400&auto=format&fit=crop",
      variant: "Size: Standard",
    },
    {
      id: "2",
      name: "Bó hoa Tulip Hồng",
      price: 750000,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1520302303350-f84820697721?q=80&w=400&auto=format&fit=crop",
      variant: "Màu sắc: Pink",
    },
  ]);

  const addItem = useCallback((item: CartItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

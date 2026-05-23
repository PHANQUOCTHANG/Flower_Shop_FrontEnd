"use client";

import { create } from "zustand";
import { CreateOrderData } from "@/types/order";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CheckoutStore {
  // Dữ liệu đơn hàng chờ submit (từ trang checkout sang order-processing)
  pendingFormData: CreateOrderData | null;

  // Actions
  setPendingCheckout: (data: CreateOrderData) => void;
  reset: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  pendingFormData: null,

  // Lưu form data trước khi redirect sang /order-processing
  setPendingCheckout: (data) => set({ pendingFormData: data }),

  // Xóa sau khi đã submit xong
  reset: () => set({ pendingFormData: null }),
}));

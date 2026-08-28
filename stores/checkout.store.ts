"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      pendingFormData: null,

      // Lưu form data trước khi redirect sang /order-processing
      setPendingCheckout: (data) => set({ pendingFormData: data }),

      // Xóa sau khi đã submit xong (xóa cả sessionStorage)
      reset: () => set({ pendingFormData: null }),
    }),
    {
      name: "checkout-storage",
      // sessionStorage: tồn tại qua F5, tự xóa khi đóng tab
      storage: createJSONStorage(() => sessionStorage),
      // Chỉ persist pendingFormData, không persist action functions
      partialize: (state) => ({ pendingFormData: state.pendingFormData }),
    },
  ),
);

import { useCallback } from "react";

export type CheckoutStep = "cart" | "checkout" | "completed";

interface CheckoutProgress {
  currentStep: CheckoutStep;
  isNavigating: boolean;
  transitionTo: (step: CheckoutStep, delay?: number) => Promise<void>;
  reset: () => void;
}

// Hook quản lý quy trình checkout 3 bước
export function useCheckoutProgress(): CheckoutProgress {
  const getCurrentStep = (): CheckoutStep => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      if (pathname.includes("/order-completed")) return "completed";
      if (pathname.includes("/checkout")) return "checkout";
      return "cart";
    }
    return "cart";
  };

  // Chuyển đổi bước với animation delay
  const transitionTo = useCallback(
    async (step: CheckoutStep, delay: number = 300) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), delay);
      });
    },
    [],
  );

  // Quay lại giỏ hàng
  const reset = useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/cart";
    }
  }, []);

  return {
    currentStep: getCurrentStep(),
    isNavigating: false,
    transitionTo,
    reset,
  };
}

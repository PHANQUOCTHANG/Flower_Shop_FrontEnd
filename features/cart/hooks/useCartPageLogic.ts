import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { checkoutEventTracker } from "@/features/checkout/hooks/checkoutEventTracker";
import {
  useCart,
  useRemoveFromCart,
  useUpdateCartQuantity,
} from "@/features/cart/hooks";
import { calculateShippingFee } from "@/features/cart/utils/cartHelpers";
import { CART_CONFIG } from "@/features/cart/constants/cartConfig";

export function useCartPageLogic() {
  const router = useRouter();

  // --- Dữ liệu giỏ hàng ---
  const {
    items: cartItems,
    total: cartTotal,
    itemCount,
    isLoading,
  } = useCart();
  const { mutate: removeItem } = useRemoveFromCart();
  const { mutate: updateQuantityMutate } = useUpdateCartQuantity();

  // --- Trạng thái cục bộ (Local State) ---
  const [includeCard, setIncludeCard] = useState(false);
  const [cardMessage, setCardMessage] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Theo dõi sự kiện Checkout (Event Tracking) ---
  useEffect(() => {
    checkoutEventTracker.trackStepStart(CART_CONFIG.STEP_NAME);

    return () => {
      checkoutEventTracker.trackStepComplete(CART_CONFIG.STEP_NAME);
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  // --- Tính toán giá trị ---
  const shippingFee = calculateShippingFee();
  const total = cartTotal + shippingFee;

  // --- Các hàm xử lý (Handlers) ---
  
  // Xử lý cập nhật số lượng
  const handleUpdateQuantity = useCallback(
    (productId: string, quantity: number) => {
      updateQuantityMutate({ productId, quantity });
    },
    [updateQuantityMutate],
  );

  // Xử lý thanh toán
  const handleCheckout = useCallback(() => {
    checkoutEventTracker.trackNavigation(CART_CONFIG.STEP_NAME, "checkout");
    setIsNavigating(true);

    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    navigationTimeoutRef.current = setTimeout(() => {
      router.push(CART_CONFIG.CHECKOUT_ROUTE);
    }, CART_CONFIG.NAVIGATION_DELAY);
  }, [router]);

  return {
    state: {
      cartItems,
      cartTotal,
      itemCount,
      isLoading,
      shippingFee,
      total,
      includeCard,
      cardMessage,
      promoCode,
      isNavigating,
    },
    actions: {
      setIncludeCard,
      setCardMessage,
      setPromoCode,
      removeItem,
      handleUpdateQuantity,
      handleCheckout,
    },
  };
}

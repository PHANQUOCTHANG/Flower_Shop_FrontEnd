import { OrderSummaryCheckout, SupportSection } from "./index";

import { CartItemResponse } from "@/features/cart/types/cart";

interface CheckoutSidebarProps {
  cartItems: CartItemResponse[];
  subtotal: number;
  total: number;
  isLoading: boolean;
  onConfirmOrder: () => void;
  paymentMethod: "bank" | "wallet" | "cod";
}

/**
 * CheckoutSidebar: Sidebar phải trang checkout
 * Gồm: Tóm tắt đơn hàng + Nút xác nhận, Phần hỗ trợ khách hàng
 */
export function CheckoutSidebar({
  cartItems,
  subtotal,
  total,
  isLoading,
  onConfirmOrder,
  paymentMethod,
}: CheckoutSidebarProps) {
  return (
    <div className="w-full space-y-6">
      {/* Tóm tắt đơn hàng */}
      <OrderSummaryCheckout
        cartItems={cartItems}
        subtotal={subtotal}
        total={total}
        onConfirmOrder={onConfirmOrder}
        isLoading={isLoading}
        paymentMethod={paymentMethod}
      />

      {/* Phần hỗ trợ khách hàng */}
      <SupportSection />
    </div>
  );
}

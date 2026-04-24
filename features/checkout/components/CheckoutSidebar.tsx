import { OrderSummaryCheckout, SupportSection } from "./index";

import { CartItemResponse } from "@/features/cart/types/cart";

interface CheckoutSidebarProps {
  cartItems: CartItemResponse[];
  subtotal: number;
  total: number;
  isLoading: boolean;
  onConfirmOrder: () => void;
  socketStatus?: null; // Không sử dụng tracker ở sidebar nữa
}

// Sidebar phải: Tóm tắt đơn hàng & hỗ trợ khách hàng
export function CheckoutSidebar({
  cartItems,
  subtotal,
  total,
  isLoading,
  onConfirmOrder,
}: CheckoutSidebarProps) {
  return (
    <div className="w-full lg:w-[420px] space-y-6">
      {/* Tóm tắt đơn hàng */}
      <OrderSummaryCheckout
        cartItems={cartItems}
        subtotal={subtotal}
        total={total}
        onConfirmOrder={onConfirmOrder}
        isLoading={isLoading}
      />

      {/* Phần hỗ trợ khách hàng */}
      <SupportSection />
    </div>
  );
}

import { OrderSummary, PromoCode } from "./index";

interface CartSidebarProps {
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  promoCode: string;
  onPromoCodeChange: (code: string) => void;
  onPromoCodeApply: () => void;
  onCheckout: () => void;
}

// Sidebar phải: tóm tắt đơn hàng & mã khuyến mãi
export function CartSidebar({
  itemCount,
  subtotal,
  shippingFee,
  total,
  promoCode,
  onPromoCodeChange,
  onPromoCodeApply,
  onCheckout,
}: CartSidebarProps) {
  return (
    <div className="w-full lg:w-[380px] space-y-6">
      {/* Tóm tắt đơn hàng */}
      <OrderSummary
        itemCount={itemCount}
        subtotal={subtotal}
        shippingFee={shippingFee}
        total={total}
        onCheckout={onCheckout}
        isCheckoutDisabled={itemCount === 0}
      />

      {/* Mã khuyến mãi */}
      <PromoCode
        promoCode={promoCode}
        onPromoCodeChange={onPromoCodeChange}
        onApply={onPromoCodeApply}
      />
    </div>
  );
}

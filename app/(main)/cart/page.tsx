"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProgressTracker } from "@/components/ui/ProgressTracker";
import { Loading } from "@/components/ui/Loading";
import { checkoutEventTracker } from "@/features/checkout/hooks/checkoutEventTracker";
import {
  CartHeader,
  CartContent,
  CartSidebar,
  GiftCard,
} from "@/features/cart/components";
import { calculateShippingFee } from "@/features/cart/utils/cartHelpers";
import {
  useCart,
  useRemoveFromCart,
  useUpdateCartQuantity,
} from "@/features/cart/hooks";
import { CART_CONFIG, CART_COLORS } from "@/features/cart/constants/cartConfig";

// Component chính trang giỏ hàng
export default function CartPage() {
  const router = useRouter();

  // Lấy dữ liệu giỏ hàng
  const {
    items: cartItems,
    total: cartTotal,
    itemCount,
    isLoading,
  } = useCart();

  // Hook xóa sản phẩm
  const { mutate: removeItem } = useRemoveFromCart();

  // Hook cập nhật số lượng
  const { mutate: updateQuantityMutate } = useUpdateCartQuantity();

  // Trạng thái cục bộ
  const [includeCard, setIncludeCard] = React.useState(false);
  const [cardMessage, setCardMessage] = React.useState("");
  const [promoCode, setPromoCode] = React.useState("");
  const [isNavigating, setIsNavigating] = React.useState(false);

  // Theo dõi bước checkout khi mount
  React.useEffect(() => {
    checkoutEventTracker.trackStepStart(CART_CONFIG.STEP_NAME);

    return () => {
      checkoutEventTracker.trackStepComplete(CART_CONFIG.STEP_NAME);
    };
  }, []);

  // Tính toán giá vận chuyển & tổng cộng
  const shippingFee = calculateShippingFee();
  const total = cartTotal + shippingFee;

  // Xử lý cập nhật số lượng sản phẩm
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateQuantityMutate({ productId, quantity });
  };

  // Xử lý thanh toán
  const handleCheckout = () => {
    checkoutEventTracker.trackNavigation(CART_CONFIG.STEP_NAME, "checkout");
    setIsNavigating(true);
    setTimeout(() => {
      router.push(CART_CONFIG.CHECKOUT_ROUTE);
    }, CART_CONFIG.NAVIGATION_DELAY);
  };

  // Trạng thái tải
  if (isLoading) return <Loading />;

  // Hiển thị
  return (
    <div
      className="min-h-screen transition-all duration-500 font-sans antialiased"
      style={{
        backgroundColor: CART_COLORS.BACKGROUND,
        color: CART_COLORS.TEXT,
        opacity: isNavigating ? 0.5 : 1,
        pointerEvents: isNavigating ? "none" : "auto",
      }}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        {/* Breadcrumb & tên trang */}
        <Breadcrumbs
          items={[{ label: "Trang chủ", href: "/" }, { label: "Giỏ hàng" }]}
        />

        {/* Thanh tiến độ checkout */}
        <ProgressTracker currentStep="cart" />

        <div className="flex flex-col gap-6 sm:gap-8 md:gap-8">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-8 lg:gap-8 items-start">
            {/* Cột trái: Danh sách sản phẩm */}
            <div className="flex-1 w-full space-y-6">
              {/* Header với tiêu đề & nút */}
              <CartHeader itemCount={itemCount} />

              {/* Nội dung giỏ hàng */}
              <CartContent
                items={cartItems || []}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={removeItem}
              />

              {/* Thẻ quà tặng */}
              <GiftCard
                includeCard={includeCard}
                cardMessage={cardMessage}
                onIncludeCardChange={setIncludeCard}
                onCardMessageChange={setCardMessage}
              />
            </div>

            {/* Cột phải: Tóm tắt & mã khuyến mãi */}
            <CartSidebar
              itemCount={itemCount}
              subtotal={cartTotal}
              shippingFee={shippingFee}
              total={total}
              promoCode={promoCode}
              onPromoCodeChange={setPromoCode}
              onPromoCodeApply={() => console.log("Áp dụng mã:", promoCode)}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

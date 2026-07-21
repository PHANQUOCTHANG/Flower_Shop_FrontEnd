"use client";

import React from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProgressTracker } from "@/components/ui/ProgressTracker";
import { CartSkeleton } from "@/components/skeletons/CartSkeleton";
import {
  CartHeader,
  CartContent,
  CartSidebar,
  GiftCard,
} from "@/features/cart/components";
import { useCartPageLogic } from "@/features/cart/hooks/useCartPageLogic";
import { CART_COLORS } from "@/features/cart/constants/cartConfig";

export default function CartPageClient() {
  const { state, actions } = useCartPageLogic();

  // --- Trạng thái tải ---
  if (state.isLoading) return <CartSkeleton />;

  // --- Render giao diện ---
  return (
    <div
      className="min-h-screen transition-all duration-500 font-sans antialiased"
      style={{
        backgroundColor: CART_COLORS.BACKGROUND,
        color: CART_COLORS.TEXT,
        opacity: state.isNavigating ? 0.5 : 1,
        pointerEvents: state.isNavigating ? "none" : "auto",
      }}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        {/* Điều hướng đường dẫn (Breadcrumb) */}
        <Breadcrumbs
          items={[{ label: "Trang chủ", href: "/" }, { label: "Giỏ hàng" }]}
        />

        {/* Thanh tiến trình (Progress Tracker) */}
        <ProgressTracker currentStep="cart" />

        <div className="flex flex-col gap-6 sm:gap-8 md:gap-8">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-8 lg:gap-8 items-start">
            
            {/* Cột trái: Danh sách sản phẩm trong giỏ */}
            <div className="flex-1 w-full space-y-6">
              {/* Phần tiêu đề giỏ hàng */}
              <CartHeader itemCount={state.itemCount} />

              {/* Danh sách các sản phẩm (Item List) */}
              <CartContent
                items={state.cartItems || []}
                onUpdateQuantity={actions.handleUpdateQuantity}
                onRemoveItem={actions.removeItem}
              />

              {/* Khối lời chúc / Thẻ quà tặng */}
              <GiftCard
                includeCard={state.includeCard}
                cardMessage={state.cardMessage}
                onIncludeCardChange={actions.setIncludeCard}
                onCardMessageChange={actions.setCardMessage}
              />
            </div>

            {/* Cột phải: Thanh tóm tắt thanh toán (Sidebar) */}
            <CartSidebar
              itemCount={state.itemCount}
              subtotal={state.cartTotal}
              shippingFee={state.shippingFee}
              total={state.total}
              promoCode={state.promoCode}
              onPromoCodeChange={actions.setPromoCode}
              onPromoCodeApply={() => console.log("Áp dụng mã:", state.promoCode)}
              onCheckout={actions.handleCheckout}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

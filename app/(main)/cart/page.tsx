"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProgressTracker } from "@/components/ui/ProgressTracker";
import { checkoutEventTracker } from "@/features/checkout/hooks/checkoutEventTracker";
import {
  CartTable,
  CartItemsMobile,
  EmptyCart,
  GiftCard,
  OrderSummary,
  PromoCode,
} from "@/features/cart/components";
import { calculateShippingFee } from "@/features/cart/utils/cartHelpers";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, removeItem, updateQuantity, cartTotal } = useCart();
  const [includeCard, setIncludeCard] = React.useState(false);
  const [cardMessage, setCardMessage] = React.useState("");
  const [promoCode, setPromoCode] = React.useState("");
  const [isNavigating, setIsNavigating] = React.useState(false);

  // Track step start on mount
  React.useEffect(() => {
    checkoutEventTracker.trackStepStart("cart");

    return () => {
      checkoutEventTracker.trackStepComplete("cart");
    };
  }, []);

  const shippingFee = calculateShippingFee();
  const total = cartTotal + shippingFee;

  const handleCheckout = () => {
    checkoutEventTracker.trackNavigation("cart", "checkout");
    setIsNavigating(true);
    setTimeout(() => {
      router.push("/checkout");
    }, 300);
  };

  return (
    <div
      className={`min-h-screen bg-[#fcfbf9] dark:bg-[#1a0f12] text-[#1b0d11] dark:text-white transition-all duration-500 font-sans antialiased ${isNavigating ? "opacity-50 pointer-events-none" : "opacity-100"}`}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[{ label: "Trang chủ", href: "/" }, { label: "Giỏ hàng" }]}
        />

        {/* Progress Tracker */}
        <ProgressTracker currentStep="cart" />

        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Column: Product List */}
            <div className="flex-1 w-full space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
                <h1 className="typo-heading-lg">
                  Giỏ hàng{" "}
                  <span className="text-[#ee2b5b]">({cartItems.length})</span>
                </h1>
                <button className="text-[#ee2b5b] hover:text-[#ee2b5b]/80 typo-button-sm flex items-center gap-2 group transition-all self-start sm:self-center">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Tiếp tục mua sắm
                </button>
              </div>

              {cartItems.length > 0 ? (
                <div className="space-y-4">
                  {/* Desktop Table View */}
                  <CartTable
                    items={cartItems}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                  />

                  {/* Mobile Card View */}
                  <CartItemsMobile
                    items={cartItems}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                  />
                </div>
              ) : (
                <EmptyCart />
              )}

              {/* Gift Card */}
              <GiftCard
                includeCard={includeCard}
                cardMessage={cardMessage}
                onIncludeCardChange={setIncludeCard}
                onCardMessageChange={setCardMessage}
              />
            </div>

            {/* Right: Summary and Promo Code */}
            <div className="w-full lg:w-[380px] space-y-6">
              <OrderSummary
                itemCount={cartItems.length}
                subtotal={cartTotal}
                shippingFee={shippingFee}
                total={total}
                onCheckout={handleCheckout}
                isCheckoutDisabled={cartItems.length === 0}
              />

              {/* Promo Code */}
              <PromoCode
                promoCode={promoCode}
                onPromoCodeChange={setPromoCode}
                onApply={() => console.log("Apply promo:", promoCode)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

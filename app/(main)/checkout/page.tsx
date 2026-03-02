"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProgressTracker } from "@/components/ui/ProgressTracker";
import { checkoutEventTracker } from "@/features/checkout/hooks/checkoutEventTracker";
import {
  RecipientForm,
  PaymentMethodSection,
  OrderSummaryCheckout,
  SupportSection,
} from "@/features/checkout/components";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal } = useCart();

  // State: Phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "wallet" | "cod">(
    "bank",
  );

  // State: Thông tin người nhận
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [giftMessage, setGiftMessage] = useState("");

  // State: Animation
  const [isNavigating, setIsNavigating] = useState(false);

  // Track step on mount
  React.useEffect(() => {
    checkoutEventTracker.trackStepStart("checkout");

    return () => {
      checkoutEventTracker.trackStepComplete("checkout");
    };
  }, []);

  // Tính toán giá tiền
  const subtotal = cartTotal;
  const discountAmount = paymentMethod === "bank" ? subtotal * 0.05 : 0;
  const shippingFee = 0;
  const total = subtotal - discountAmount + shippingFee;

  // Xử lý xác nhận đặt hàng
  const handleConfirmOrder = () => {
    checkoutEventTracker.trackNavigation("checkout", "completed");
    setIsNavigating(true);
    setTimeout(() => {
      router.push("/order-completed");
    }, 300);
  };

  return (
    <div
      className={`min-h-screen bg-[#fcfbf9] dark:bg-[#1a0f12] text-[#1b0d11] dark:text-white transition-all duration-500 font-sans antialiased ${isNavigating ? "opacity-50 pointer-events-none" : "opacity-100"}`}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Giỏ hàng", href: "/cart" },
            { label: "Thanh toán" },
          ]}
        />

        {/* Progress Tracker */}
        <ProgressTracker currentStep="checkout" />

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Left Column: Form */}
          <div className="flex-1 space-y-10">
            {/* Recipient information form */}
            <RecipientForm
              recipientName={recipientName}
              recipientPhone={recipientPhone}
              deliveryAddress={deliveryAddress}
              deliveryDate={deliveryDate}
              deliveryTime={deliveryTime}
              giftMessage={giftMessage}
              onRecipientNameChange={setRecipientName}
              onRecipientPhoneChange={setRecipientPhone}
              onDeliveryAddressChange={setDeliveryAddress}
              onDeliveryDateChange={setDeliveryDate}
              onDeliveryTimeChange={setDeliveryTime}
              onGiftMessageChange={setGiftMessage}
            />

            {/* Payment method selection */}
            <PaymentMethodSection
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />
          </div>

          {/* Right Column: Order summary & Support */}
          <div className="w-full lg:w-[420px] space-y-6">
            {/* Order summary */}
            <OrderSummaryCheckout
              cartItems={cartItems}
              subtotal={subtotal}
              discountAmount={discountAmount}
              total={total}
              onConfirmOrder={handleConfirmOrder}
            />

            {/* Support section */}
            <SupportSection />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-12 border-t border-gray-100 dark:border-white/5 text-center px-4 bg-white dark:bg-black/10">
        <p className="typo-caption-xs text-gray-400">
          © 2024 Flower Shop • Trao gửi yêu thương trên từng đóa hoa
        </p>
        <div className="flex justify-center gap-4 mt-4 grayscale opacity-30">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
            className="h-4"
            alt="PayPal"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
            className="h-4"
            alt="Visa"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
            className="h-4"
            alt="Mastercard"
          />
        </div>
      </footer>
    </div>
  );
}

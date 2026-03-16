"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useCart, useFetchCart } from "@/features/cart/hooks";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProgressTracker } from "@/components/ui/ProgressTracker";
import Alert from "@/components/ui/Alert";
import { checkoutEventTracker } from "@/features/checkout/hooks/checkoutEventTracker";
import { useCheckout } from "@/features/checkout/hooks/useCheckout";
import {
  RecipientForm,
  PaymentMethodSection,
  OrderSummaryCheckout,
  SupportSection,
} from "@/features/checkout/components";

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { items: cartItems, total: cartTotal } = useCart();

  // State: Phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "wallet" | "cod">(
    "bank",
  );

  // State: Trạng thái thanh toán
  const [paymentStatus, setPaymentStatus] = useState<"unpaid" | "paid">(
    "unpaid",
  );

  // State: Thông tin giao hàng (Shipping Info)
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  // State: Animation
  const [isNavigating, setIsNavigating] = useState(false);

  // State: Alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  // Hook: Checkout
  const { createOrder, isLoading: isCreatingOrder } = useCheckout({
    onSuccess: (order) => {
      checkoutEventTracker.trackNavigation("checkout", "completed");

      // Invalidate cart queries to reload header and cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      setAlertType("success");
      setAlertMessage("Đặt hàng thành công!");
      setShowAlert(true);

      // Redirect sau 2 giây
      setTimeout(() => {
        router.push(`/order-completed?id=${order.id}`);
      }, 2000);
    },
    onError: (error: any) => {
      setAlertType("error");
      setAlertMessage(error?.message || "Có lỗi xảy ra khi đặt hàng");
      setShowAlert(true);
    },
  });

  // Track step on mount
  React.useEffect(() => {
    checkoutEventTracker.trackStepStart("checkout");

    return () => {
      checkoutEventTracker.trackStepComplete("checkout");
    };
  }, []);

  // Tính toán giá tiền (theo model Order)
  const subtotal = cartTotal;
  const totalPrice = subtotal;

  // Xử lý xác nhận đặt hàng
  const handleConfirmOrder = async () => {
    // Validate form
    if (!name || !shippingPhone || !shippingAddress) {
      setAlertType("error");
      setAlertMessage("Vui lòng điền đầy đủ thông tin giao hàng");
      setShowAlert(true);
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setAlertType("error");
      setAlertMessage("Giỏ hàng trống, vui lòng thêm sản phẩm");
      setShowAlert(true);
      return;
    }

    // Transform cartItems to OrderItem format
    const orderItems = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.product.price,
      subtotal: item.product.price * item.quantity,
    }));

    // Gọi hook create order
    try {
      await createOrder({
        totalPrice,
        shippingAddress,
        shippingPhone,
        paymentMethod,
        paymentStatus,
        name,
        note,
        items: orderItems,
      });
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <div
      className={`min-h-screen bg-[#fcfbf9] dark:bg-[#1a0f12] text-[#1b0d11] dark:text-white transition-all duration-500 font-sans antialiased ${
        isNavigating ? "opacity-50 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Alert Notifications */}
      {showAlert && (
        <div className="fixed top-24 right-6 z-50 max-w-md">
          <Alert
            type={alertType}
            message={alertMessage}
            onClose={() => setShowAlert(false)}
            autoClose={alertType === "error" ? true : false}
            duration={alertType === "error" ? 4000 : 2000}
          />
        </div>
      )}

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
            {/* Shipping information form */}
            <RecipientForm
              shippingPhone={shippingPhone}
              shippingAddress={shippingAddress}
              name={name}
              note={note}
              onShippingPhoneChange={setShippingPhone}
              onShippingAddressChange={setShippingAddress}
              onNameChange={setName}
              onNoteChange={setNote}
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
              total={totalPrice}
              onConfirmOrder={handleConfirmOrder}
              isLoading={isCreatingOrder}
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

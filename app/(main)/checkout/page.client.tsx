"use client";

import React from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProgressTracker } from "@/components/ui/ProgressTracker";
import Alert from "@/components/ui/Alert";
import {
  CheckoutForm,
  CheckoutSidebar,
  CheckoutFooter,
} from "@/features/checkout/components";
import { useCheckoutPageLogic } from "@/features/checkout/hooks/useCheckoutPageLogic";
import {
  CHECKOUT_CONFIG,
  CHECKOUT_COLORS,
} from "@/features/checkout/constants/checkoutConfig";

export default function CheckoutPageClient() {
  const { state, actions } = useCheckoutPageLogic();

  // --- Render giao diện ---
  return (
    <div
      className="min-h-screen transition-all duration-500 font-sans antialiased"
      style={{
        backgroundColor: CHECKOUT_COLORS.BACKGROUND,
        color: CHECKOUT_COLORS.TEXT,
        opacity: state.isNavigating ? 0.5 : 1,
        pointerEvents: state.isNavigating ? "none" : "auto",
      }}
    >
      {/* Khối thông báo (Alert) */}
      {state.showAlert && (
        <div className="fixed top-24 right-6 z-50 max-w-md">
          <Alert
            type={state.alertType}
            message={state.alertMessage}
            onClose={() => actions.setShowAlert(false)}
            autoClose={state.alertType === "error"}
            duration={
              state.alertType === "error"
                ? CHECKOUT_CONFIG.ALERT_DURATION_ERROR
                : CHECKOUT_CONFIG.ALERT_DURATION_SUCCESS
            }
          />
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        {/* Điều hướng đường dẫn (Breadcrumb) */}
        <Breadcrumbs
          items={[
            { label: "Trang chủ", href: CHECKOUT_CONFIG.HOME_ROUTE },
            { label: "Giỏ hàng", href: CHECKOUT_CONFIG.CART_ROUTE },
            { label: "Thanh toán" },
          ]}
        />

        {/* Thanh tiến trình (Progress Tracker) */}
        <ProgressTracker currentStep="checkout" />

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-8 lg:gap-8 items-start">
          
          {/* Cột trái: Form thông tin người nhận và thanh toán */}
          <div className="flex-1 w-full">
            <CheckoutForm
              name={state.name}
              shippingPhone={state.shippingPhone}
              shippingAddress={state.shippingAddress}
              note={state.note}
              paymentMethod={state.paymentMethod}
              errors={state.errors}
              selectedAddressId={state.selectedAddressId}
              onNameChange={actions.setName}
              onShippingPhoneChange={actions.setShippingPhone}
              onShippingAddressChange={actions.setShippingAddress}
              onNoteChange={actions.setNote}
              onPaymentMethodChange={actions.setPaymentMethod}
              onAddressSelect={actions.handleAddressSelect}
            />
          </div>

          {/* Cột phải: Thanh tóm tắt đơn hàng (Sidebar) */}
          <CheckoutSidebar
            cartItems={state.cartItems || []}
            subtotal={state.cartTotal}
            total={state.cartTotal}
            isLoading={state.isCreatingOrder}
            onConfirmOrder={actions.handleConfirmOrder}
            socketStatus={null}
          />
        </div>
      </main>

      {/* Chân trang thanh toán (Footer) */}
      <CheckoutFooter />
    </div>
  );
}

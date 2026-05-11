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

  return (
    <div
      className="min-h-screen transition-all duration-500 font-sans antialiased pb-20"
      style={{
        backgroundColor: CHECKOUT_COLORS.BACKGROUND,
        color: CHECKOUT_COLORS.TEXT,
        opacity: state.isNavigating ? 0.5 : 1,
        pointerEvents: state.isNavigating ? "none" : "auto",
      }}
    >
      {/* Alert Component */}
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

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Navigation Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Trang chủ", href: CHECKOUT_CONFIG.HOME_ROUTE },
              { label: "Giỏ hàng", href: CHECKOUT_CONFIG.CART_ROUTE },
              { label: "Thanh toán" },
            ]}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column: Form & Payment */}
          <div className="flex-1 w-full space-y-8">
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

          {/* Right Column: Order Summary Sidebar */}
          <div className="w-full lg:w-[400px]">
            <CheckoutSidebar
              cartItems={state.cartItems || []}
              subtotal={state.cartTotal}
              total={state.cartTotal}
              isLoading={state.isCreatingOrder}
              onConfirmOrder={actions.handleConfirmOrder}
              socketStatus={null}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <CheckoutFooter />
    </div>
  );
}

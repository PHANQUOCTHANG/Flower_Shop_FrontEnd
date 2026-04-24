"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

// Import UI components
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProgressTracker } from "@/components/ui/ProgressTracker";
import Alert from "@/components/ui/Alert";

// Import checkout components
import {
  CheckoutForm,
  CheckoutSidebar,
  CheckoutFooter,
} from "@/features/checkout/components";

// Import hooks
import { useCart } from "@/features/cart/hooks";
import { useCheckout } from "@/features/checkout/hooks/useCheckout";
import { checkoutEventTracker } from "@/features/checkout/hooks/checkoutEventTracker";
import {
  useAddressesForCheckout,
  useDefaultAddress,
  formatFullAddress,
} from "@/features/checkout/hooks/useAddressesForCheckout";

// Import types
import type { Address } from "@/types/profile";

// Import utils & constants
import {
  validateCheckoutForm,
  type FormData,
} from "@/features/checkout/utils/formValidation";
import {
  CHECKOUT_CONFIG,
  CHECKOUT_COLORS,
  VALIDATION_MESSAGES,
} from "@/features/checkout/constants/checkoutConfig";

// Component chính trang checkout
export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Lấy dữ liệu giỏ hàng
  const { items: cartItems, total: cartTotal } = useCart();

  // Fetch dữ liệu addresses
  const defaultAddress = useDefaultAddress();

  // Trạng thái form
  const [name, setName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [note, setNote] = useState("");

  // Trạng thái địa chỉ được chọn
  const [selectedAddressId, setSelectedAddressId] = useState<
    string | undefined
  >();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // Trạng thái thanh toán
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "wallet" | "cod">(
    "bank",
  );
  const [paymentStatus, setPaymentStatus] = useState<"unpaid" | "paid">(
    "unpaid",
  );

  // Trạng thái UI
  const [isNavigating, setIsNavigating] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Hook tạo đơn hàng
  const { createOrder, isLoading: isCreatingOrder } = useCheckout({
    queryClient, // Pass queryClient để hook xử lí cache invalidation
    onJobIdReceived: (jobId) => {
      // Redirect sang trang xử lí đơn hàng khi nhận jobId (202 response)
      console.log(
        "[CheckoutPage] Redirecting to order processing with jobId:",
        jobId,
      );
      router.push(`/order-processing?jobId=${jobId}`);
    },
    onSuccess: (order) => {
      // Hook đã xử lí cache invalidation, page chỉ cần track events
      checkoutEventTracker.trackNavigation(
        CHECKOUT_CONFIG.STEP_NAME,
        "completed",
      );
    },
    onError: (error: any) => {
      // Xử lí lỗi - show alert ở checkout page
      console.error("[CheckoutPage] Order error:", error);
      setAlertType("error");
      setAlertMessage(error?.message || VALIDATION_MESSAGES.ORDER_ERROR);
      setShowAlert(true);
    },
  });

  // Theo dõi bước checkout khi mount
  React.useEffect(() => {
    checkoutEventTracker.trackStepStart(CHECKOUT_CONFIG.STEP_NAME);

    return () => {
      checkoutEventTracker.trackStepComplete(CHECKOUT_CONFIG.STEP_NAME);
    };
  }, []);

  // Auto-fill form khi có default address
  React.useEffect(() => {
    if (defaultAddress && !selectedAddress) {
      setSelectedAddress(defaultAddress);
      setSelectedAddressId(defaultAddress.id);
      setName(defaultAddress.name);
      setShippingPhone(defaultAddress.phone);
      setShippingAddress(formatFullAddress(defaultAddress));
    }
  }, [defaultAddress, selectedAddress]);

  // Tính toán tổng giá tiền
  const subtotal = cartTotal;
  const totalPrice = subtotal;

  // Xử lý chọn địa chỉ từ danh sách
  const handleAddressSelect = (address: Address) => {
    // Nếu đã chọn rồi, bỏ chọn
    if (selectedAddressId === address.id) {
      setSelectedAddress(null);
      setSelectedAddressId(undefined);

      // Nếu có default address, auto-fill lại default
      if (defaultAddress) {
        setName(defaultAddress.name);
        setShippingPhone(defaultAddress.phone);
        setShippingAddress(formatFullAddress(defaultAddress));
      } else {
        // Nếu không có default address, reset toàn bộ form
        setName("");
        setShippingPhone("");
        setShippingAddress("");
        setNote("");
      }
      return;
    }

    // Nếu chưa chọn, chọn địa chỉ này
    setSelectedAddress(address);
    setSelectedAddressId(address.id);
    setName(address.name);
    setShippingPhone(address.phone);
    setShippingAddress(formatFullAddress(address));
  };

  // Xử lý xác nhận đơn hàng
  const handleConfirmOrder = async () => {
    // Validate form
    const formData: FormData = {
      name,
      shippingAddress,
      shippingPhone,
      note,
    };

    const validationErrors = validateCheckoutForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      window.scrollTo({ top: 100, behavior: "smooth" });
      setAlertType("error");
      setAlertMessage(VALIDATION_MESSAGES.FORM_ERROR);
      setShowAlert(true);
      return;
    }

    // Kiểm tra giỏ hàng
    if (!cartItems || cartItems.length === 0) {
      setAlertType("error");
      setAlertMessage(VALIDATION_MESSAGES.CART_EMPTY);
      setShowAlert(true);
      return;
    }

    // Transform cartItems thành OrderItem format
    const orderItems = cartItems.map((item) => {
      const price =
        typeof item.product.price === "string"
          ? parseFloat(item.product.price)
          : item.product.price;

      return {
        productId: item.product.id,
        quantity: item.quantity,
        price: price,
        subtotal: price * item.quantity,
      };
    });

    try {
      const requestData = {
        totalPrice:
          typeof totalPrice === "string" ? parseFloat(totalPrice) : totalPrice,
        shippingAddress: shippingAddress.trim(),
        shippingPhone: shippingPhone.trim().replace(/\s/g, ""),
        paymentMethod,
        paymentStatus,
        name: name.trim(),
        note: note.trim(),
        items: orderItems,
      };

      await createOrder(requestData);
    } catch (error) {
      console.error("Lỗi tạo đơn hàng:", error);
    }
  };

  // Hiển thị
  return (
    <div
      className="min-h-screen transition-all duration-500 font-sans antialiased"
      style={{
        backgroundColor: CHECKOUT_COLORS.BACKGROUND,
        color: CHECKOUT_COLORS.TEXT,
        opacity: isNavigating ? 0.5 : 1,
        pointerEvents: isNavigating ? "none" : "auto",
      }}
    >
      {/* Thông báo alert */}
      {showAlert && (
        <div className="fixed top-24 right-6 z-50 max-w-md">
          <Alert
            type={alertType}
            message={alertMessage}
            onClose={() => setShowAlert(false)}
            autoClose={alertType === "error"}
            duration={
              alertType === "error"
                ? CHECKOUT_CONFIG.ALERT_DURATION_ERROR
                : CHECKOUT_CONFIG.ALERT_DURATION_SUCCESS
            }
          />
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        {/* Breadcrumb & tên trang */}
        <Breadcrumbs
          items={[
            { label: "Trang chủ", href: CHECKOUT_CONFIG.HOME_ROUTE },
            { label: "Giỏ hàng", href: CHECKOUT_CONFIG.CART_ROUTE },
            { label: "Thanh toán" },
          ]}
        />

        {/* Thanh tiến độ checkout */}
        <ProgressTracker currentStep="checkout" />

        {/* Form + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-8 lg:gap-8 items-start">
          {/* Cột trái: Form thông tin */}
          <div className="flex-1 w-full">
            <CheckoutForm
              name={name}
              shippingPhone={shippingPhone}
              shippingAddress={shippingAddress}
              note={note}
              paymentMethod={paymentMethod}
              errors={errors}
              selectedAddressId={selectedAddressId}
              onNameChange={setName}
              onShippingPhoneChange={setShippingPhone}
              onShippingAddressChange={setShippingAddress}
              onNoteChange={setNote}
              onPaymentMethodChange={setPaymentMethod}
              onAddressSelect={handleAddressSelect}
            />
          </div>

          {/* Cột phải: Tóm tắt & hỗ trợ */}
          <CheckoutSidebar
            cartItems={cartItems || []}
            subtotal={subtotal}
            total={totalPrice}
            isLoading={isCreatingOrder}
            onConfirmOrder={handleConfirmOrder}
            socketStatus={null}
          />
        </div>
      </main>

      {/* Footer */}
      <CheckoutFooter />
    </div>
  );
}

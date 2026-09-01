import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart/hooks";
import { checkoutEventTracker } from "@/features/checkout/hooks/checkoutEventTracker";
import {
  useDefaultAddress,
  formatFullAddress,
} from "@/features/checkout/hooks/useAddressesForCheckout";
import {
  validateCheckoutForm,
  type FormData,
} from "@/features/checkout/utils/formValidation";
import {
  CHECKOUT_CONFIG,
  VALIDATION_MESSAGES,
} from "@/features/checkout/constants/checkoutConfig";
import type { Address } from "@/types/profile";
import { useAuthStore } from "@/stores/auth.store";
import { useCheckoutStore } from "@/stores/checkout.store";

export function useCheckoutPageLogic() {
  const router = useRouter();

  // --- Dữ liệu giỏ hàng & Địa chỉ ---
  const { items: cartItems, total: cartTotal } = useCart();
  const defaultAddress = useDefaultAddress();
  const user = useAuthStore((s) => s.user);

  // --- Trạng thái Form (Form State) ---
  const [name, setName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [note, setNote] = useState("");

  // --- Trạng thái Địa chỉ & Thanh toán (Selection State) ---
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "cod" | "vnpay">("cod");
  const [paymentStatus] = useState<"unpaid" | "paid">("unpaid");

  // --- Trạng thái Giao diện (UI State) ---
  const [isNavigating, setIsNavigating] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- Theo dõi sự kiện Checkout (Event Tracking) ---
  useEffect(() => {
    checkoutEventTracker.trackStepStart(CHECKOUT_CONFIG.STEP_NAME);
    return () => {
      checkoutEventTracker.trackStepComplete(CHECKOUT_CONFIG.STEP_NAME);
    };
  }, []);

  // --- Tự động điền Form từ Địa chỉ mặc định (Auto-fill) ---
  useEffect(() => {
    if (defaultAddress && !selectedAddress) {
      setSelectedAddress(defaultAddress);
      setSelectedAddressId(defaultAddress.id);
      setName(defaultAddress.name);
      setShippingPhone(defaultAddress.phone);
      setShippingAddress(formatFullAddress(defaultAddress));
    } else if (user && !name && !shippingPhone && !selectedAddress) {
      // Nếu không có địa chỉ mặc định, thử lấy từ profile User
      setName(user.fullName || "");
      setShippingPhone(user.phone || "");
    }
  }, [defaultAddress, selectedAddress, user, name, shippingPhone]);

  // --- Các hàm xử lý (Handlers) ---

  // Xử lý khi người dùng chọn địa chỉ khác
  const handleAddressSelect = useCallback(
    (address: Address) => {
      if (selectedAddressId === address.id) {
        // Bỏ chọn nếu click lại địa chỉ đang chọn
        setSelectedAddress(null);
        setSelectedAddressId(undefined);

        if (defaultAddress) {
          // Quay về địa chỉ mặc định
          setName(defaultAddress.name);
          setShippingPhone(defaultAddress.phone);
          setShippingAddress(formatFullAddress(defaultAddress));
        } else {
          // Reset form nếu không có địa chỉ mặc định
          setName("");
          setShippingPhone("");
          setShippingAddress("");
          setNote("");
        }
        return;
      }

      // Điền thông tin từ địa chỉ được chọn
      setSelectedAddress(address);
      setSelectedAddressId(address.id);
      setName(address.name);
      setShippingPhone(address.phone);
      setShippingAddress(formatFullAddress(address));
    },
    [selectedAddressId, defaultAddress],
  );

  // Xử lý khi nhấn nút Đặt hàng
  const handleConfirmOrder = useCallback(async () => {
    const formData: FormData = {
      name,
      shippingAddress,
      shippingPhone,
      note,
    };

    // 1. Kiểm tra tính hợp lệ của Form
    const validationErrors = validateCheckoutForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      window.scrollTo({ top: 100, behavior: "smooth" });
      setAlertType("error");
      setAlertMessage(VALIDATION_MESSAGES.FORM_ERROR);
      setShowAlert(true);
      return;
    }

    // 2. Kiểm tra Giỏ hàng
    if (!cartItems || cartItems.length === 0) {
      setAlertType("error");
      setAlertMessage(VALIDATION_MESSAGES.CART_EMPTY);
      setShowAlert(true);
      return;
    }

    // 3. Chuẩn bị dữ liệu Đơn hàng
    const orderItems = cartItems.map((item) => {
      const price =
        typeof item.product.price === "string"
          ? parseFloat(item.product.price)
          : item.product.price;
      return {
        productId: item.product.id,
        quantity: item.quantity,
        price,
        subtotal: price * item.quantity,
      };
    });

    const requestData = {
      totalPrice: typeof cartTotal === "string" ? parseFloat(cartTotal) : cartTotal,
      shippingAddress: shippingAddress.trim(),
      shippingPhone: shippingPhone.trim().replace(/\s/g, ""),
      paymentMethod,
      paymentStatus,
      name: name.trim(),
      note: note.trim(),
      items: orderItems,
    };

    // 4. Lưu form data vào store → redirect ngay sang /order-processing?mode=submit
    //    API call sẽ được thực hiện tại trang order-processing
    //    → Thời gian hiển thị "đang xử lý" = thời gian thực server phản hồi
    checkoutEventTracker.trackNavigation(CHECKOUT_CONFIG.STEP_NAME, "completed");
    useCheckoutStore.getState().setPendingCheckout(requestData);
    setIsNavigating(true);
    router.push("/order-processing?mode=submit");
  }, [
    name,
    shippingAddress,
    shippingPhone,
    note,
    cartItems,
    cartTotal,
    paymentMethod,
    paymentStatus,
    router,
  ]);

  return {
    state: {
      name,
      shippingPhone,
      shippingAddress,
      note,
      selectedAddressId,
      paymentMethod,
      cartItems,
      cartTotal,
      isCreatingOrder: isNavigating, // Alias để không phải sửa các component dùng isCreatingOrder
      isNavigating,
      showAlert,
      alertMessage,
      alertType,
      errors,
    },
    actions: {
      setName,
      setShippingPhone,
      setShippingAddress,
      setNote,
      setPaymentMethod,
      handleAddressSelect,
      handleConfirmOrder,
      setShowAlert,
    },
  };
}

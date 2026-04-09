// Config cho trang checkout
export const CHECKOUT_CONFIG = {
  ROUTE: "/checkout" as const,
  CART_ROUTE: "/cart" as const,
  HOME_ROUTE: "/" as const,
  ORDER_COMPLETED_ROUTE: "/order-completed" as const,
  STEP_NAME: "checkout" as const,
  NAVIGATION_DELAY: 2000,
  ALERT_DURATION_ERROR: 4000,
  ALERT_DURATION_SUCCESS: 2000,
} as const;

// Màu sắc trang checkout
export const CHECKOUT_COLORS = {
  BACKGROUND: "#fcfbf9",
  TEXT: "#1b0d11",
  BORDER: "#e7f3eb",
  BORDER_GRAY: "gray-100",
} as const;

// Validation messages
export const VALIDATION_MESSAGES = {
  NAME_REQUIRED: "Tên không được để trống",
  NAME_MAX: "Tên tối đa 255 ký tự",
  ADDRESS_REQUIRED: "Địa chỉ giao hàng không được để trống",
  ADDRESS_MAX: "Địa chỉ tối đa 500 ký tự",
  PHONE_REQUIRED: "Số điện thoại không được để trống",
  PHONE_INVALID: "Số điện thoại không hợp lệ (Ví dụ: 0901234567)",
  NOTE_MAX: "Ghi chú tối đa 500 ký tự",
  FORM_ERROR: "Vui lòng kiểm tra lại các trường báo đỏ ở trên",
  CART_EMPTY: "Giỏ hàng trống, vui lòng thêm sản phẩm",
  ORDER_SUCCESS: "Đặt hàng thành công!",
  ORDER_ERROR: "Có lỗi xảy ra khi đặt hàng",
} as const;

// Regex patterns
export const PATTERNS = {
  // Format: 0912345678 hoặc +84912345678
  // Bắt đầu 0 hoặc +84, sau đó [3,5,7,8,9], rồi 8 chữ số
  PHONE: /^(0|\+84)[35789][0-9]{8}$/,
} as const;

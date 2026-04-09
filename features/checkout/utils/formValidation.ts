import { VALIDATION_MESSAGES, PATTERNS } from "../constants/checkoutConfig";

export interface ValidationErrors {
  [key: string]: string;
}

export interface FormData {
  name: string;
  shippingAddress: string;
  shippingPhone: string;
  note: string;
}

// Validate form data & return errors
export function validateCheckoutForm(data: FormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Kiểm tra tên
  if (!data.name || data.name.trim().length === 0) {
    errors.name = VALIDATION_MESSAGES.NAME_REQUIRED;
  } else if (data.name.trim().length > 255) {
    errors.name = VALIDATION_MESSAGES.NAME_MAX;
  }

  // Kiểm tra địa chỉ
  if (!data.shippingAddress || data.shippingAddress.trim().length === 0) {
    errors.shippingAddress = VALIDATION_MESSAGES.ADDRESS_REQUIRED;
  } else if (data.shippingAddress.trim().length > 500) {
    errors.shippingAddress = VALIDATION_MESSAGES.ADDRESS_MAX;
  }

  // Kiểm tra số điện thoại
  if (!data.shippingPhone || data.shippingPhone.trim().length === 0) {
    errors.shippingPhone = VALIDATION_MESSAGES.PHONE_REQUIRED;
  } else if (
    !PATTERNS.PHONE.test(data.shippingPhone.trim().replace(/\s/g, ""))
  ) {
    errors.shippingPhone = VALIDATION_MESSAGES.PHONE_INVALID;
  }

  // Kiểm tra ghi chú
  if (data.note && data.note.trim().length > 500) {
    errors.note = VALIDATION_MESSAGES.NOTE_MAX;
  }

  return errors;
}

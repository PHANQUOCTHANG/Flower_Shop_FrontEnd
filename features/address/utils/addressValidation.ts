import type { CreateAddressRequest } from "@/types/profile";

// Validation messages cho address
export const ADDRESS_VALIDATION_MESSAGES = {
  // Name
  NAME_REQUIRED: "Tên người nhận không được để trống",
  NAME_MAX: "Tên người nhận tối đa 255 ký tự",

  // Phone
  PHONE_REQUIRED: "Số điện thoại không được để trống",
  PHONE_INVALID: "Số điện thoại không hợp lệ (Ví dụ: 0901234567)",

  // Location
  PROVINCE_REQUIRED: "Tỉnh/Thành phố không được để trống",
  DISTRICT_REQUIRED: "Quận/Huyện không được để trống",
  WARD_REQUIRED: "Phường/Xã không được để trống",

  // Street
  STREET_REQUIRED: "Địa chỉ chi tiết không được để trống",
  STREET_MAX: "Địa chỉ chi tiết tối đa 500 ký tự",
} as const;

// Regex patterns
export const ADDRESS_PATTERNS = {
  // Format: 0912345678 hoặc +84912345678
  // Bắt đầu 0 hoặc +84, sau đó [3,5,7,8,9], rồi 8 chữ số
  PHONE: /^(0|\+84)[35789][0-9]{8}$/,
} as const;

// Validation errors interface
export interface AddressValidationErrors {
  [key: string]: string;
}

/**
 * Validate address form data (dùng cho Profile AddressForm)
 * @param data - Form data to validate
 * @returns Object with validation errors (empty if no errors)
 */
export function validateAddressForm(
  data: CreateAddressRequest,
): AddressValidationErrors {
  const errors: AddressValidationErrors = {};

  // Kiểm tra tên
  if (!data.name || data.name.trim().length === 0) {
    errors.name = ADDRESS_VALIDATION_MESSAGES.NAME_REQUIRED;
  } else if (data.name.trim().length > 255) {
    errors.name = ADDRESS_VALIDATION_MESSAGES.NAME_MAX;
  }

  // Kiểm tra số điện thoại
  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = ADDRESS_VALIDATION_MESSAGES.PHONE_REQUIRED;
  } else if (
    !ADDRESS_PATTERNS.PHONE.test(data.phone.trim().replace(/\s/g, ""))
  ) {
    errors.phone = ADDRESS_VALIDATION_MESSAGES.PHONE_INVALID;
  }

  // Kiểm tra tỉnh/thành phố
  if (!data.provinceCode) {
    errors.provinceCode = ADDRESS_VALIDATION_MESSAGES.PROVINCE_REQUIRED;
  }

  // Kiểm tra quận/huyện
  if (!data.districtCode) {
    errors.districtCode = ADDRESS_VALIDATION_MESSAGES.DISTRICT_REQUIRED;
  }

  // Kiểm tra phường/xã
  if (!data.wardCode) {
    errors.wardCode = ADDRESS_VALIDATION_MESSAGES.WARD_REQUIRED;
  }

  // Kiểm tra địa chỉ chi tiết
  if (!data.streetDetail || data.streetDetail.trim().length === 0) {
    errors.streetDetail = ADDRESS_VALIDATION_MESSAGES.STREET_REQUIRED;
  } else if (data.streetDetail.trim().length > 500) {
    errors.streetDetail = ADDRESS_VALIDATION_MESSAGES.STREET_MAX;
  }

  return errors;
}

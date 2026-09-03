import {
  RecipientForm,
  PaymentMethodSection,
  BankTransferDetails,
} from "./index";
import { ValidationErrors } from "../utils/formValidation";
import type { Address } from "@/types/profile";

interface CheckoutFormProps {
  name: string;
  shippingPhone: string;
  shippingAddress: string;
  note: string;
  paymentMethod: "bank" | "cod" | "vnpay" | "zalopay";
  errors: ValidationErrors;
  selectedAddressId?: string;
  onNameChange: (value: string) => void;
  onShippingPhoneChange: (value: string) => void;
  onShippingAddressChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onPaymentMethodChange: (method: "bank" | "cod" | "vnpay" | "zalopay") => void;
  onAddressSelect: (address: Address) => void;
}

/**
 * CheckoutForm: Form chính của trang thanh toán
 * Gồm: Thông tin giao hàng, Phương thức thanh toán, Chi tiết chuyển khoản (nếu chọn)
 */
export function CheckoutForm({
  name,
  shippingPhone,
  shippingAddress,
  note,
  paymentMethod,
  errors,
  selectedAddressId,
  onNameChange,
  onShippingPhoneChange,
  onShippingAddressChange,
  onNoteChange,
  onPaymentMethodChange,
  onAddressSelect,
}: CheckoutFormProps) {
  return (
    <div className="flex-1 space-y-6 sm:space-y-8 md:space-y-10">
      {/* Thông tin giao hàng */}
      <RecipientForm
        name={name}
        shippingPhone={shippingPhone}
        shippingAddress={shippingAddress}
        note={note}
        errors={errors}
        selectedAddressId={selectedAddressId}
        onNameChange={onNameChange}
        onShippingPhoneChange={onShippingPhoneChange}
        onShippingAddressChange={onShippingAddressChange}
        onNoteChange={onNoteChange}
        onAddressSelect={onAddressSelect}
      />

      {/* Phương thức thanh toán */}
      <PaymentMethodSection
        paymentMethod={paymentMethod}
        onPaymentMethodChange={onPaymentMethodChange}
      />

      {/* Chi tiết chuyển khoản ngân hàng (hiển thị khi chọn thanh toán bằng ngân hàng) */}
      {paymentMethod === "bank" && <BankTransferDetails />}
    </div>
  );
}

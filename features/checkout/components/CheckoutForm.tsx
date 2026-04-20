import { RecipientForm, PaymentMethodSection } from "./index";
import { ValidationErrors } from "../utils/formValidation";
import type { Address } from "@/types/profile";

interface CheckoutFormProps {
  name: string;
  shippingPhone: string;
  shippingAddress: string;
  note: string;
  paymentMethod: "bank" | "wallet" | "cod";
  errors: ValidationErrors;
  selectedAddressId?: string;
  onNameChange: (value: string) => void;
  onShippingPhoneChange: (value: string) => void;
  onShippingAddressChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onPaymentMethodChange: (method: "bank" | "wallet" | "cod") => void;
  onAddressSelect: (address: Address) => void;
}

// Form đơn hàng: Thông tin giao hàng & phương thức thanh toán
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
      {/* Form thông tin giao hàng (chứa danh sách địa chỉ) */}
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

      {/* Chọn phương thức thanh toán */}
      <PaymentMethodSection
        paymentMethod={paymentMethod}
        onPaymentMethodChange={onPaymentMethodChange}
      />
    </div>
  );
}

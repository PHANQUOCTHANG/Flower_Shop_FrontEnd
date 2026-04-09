import { RecipientForm, PaymentMethodSection } from "./index";
import { ValidationErrors } from "../utils/formValidation";

interface CheckoutFormProps {
  name: string;
  shippingPhone: string;
  shippingAddress: string;
  note: string;
  paymentMethod: "bank" | "wallet" | "cod";
  errors: ValidationErrors;
  onNameChange: (value: string) => void;
  onShippingPhoneChange: (value: string) => void;
  onShippingAddressChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onPaymentMethodChange: (method: "bank" | "wallet" | "cod") => void;
}

// Form đơn hàng: Thông tin giao hàng & phương thức thanh toán
export function CheckoutForm({
  name,
  shippingPhone,
  shippingAddress,
  note,
  paymentMethod,
  errors,
  onNameChange,
  onShippingPhoneChange,
  onShippingAddressChange,
  onNoteChange,
  onPaymentMethodChange,
}: CheckoutFormProps) {
  return (
    <div className="flex-1 space-y-6 sm:space-y-8 md:space-y-10">
      {/* Form thông tin giao hàng */}
      <RecipientForm
        name={name}
        shippingPhone={shippingPhone}
        shippingAddress={shippingAddress}
        note={note}
        errors={errors}
        onNameChange={onNameChange}
        onShippingPhoneChange={onShippingPhoneChange}
        onShippingAddressChange={onShippingAddressChange}
        onNoteChange={onNoteChange}
      />

      {/* Chọn phương thức thanh toán */}
      <PaymentMethodSection
        paymentMethod={paymentMethod}
        onPaymentMethodChange={onPaymentMethodChange}
      />
    </div>
  );
}

import React from "react";
import { CreditCard, Landmark, Wallet, ShoppingBag } from "lucide-react";

interface PaymentMethodSectionProps {
  paymentMethod: "bank" | "wallet" | "cod";
  onPaymentMethodChange: (method: "bank" | "wallet" | "cod") => void;
}

const PAYMENT_METHODS = [
  {
    id: "bank" as const,
    title: "Chuyển khoản ngân hàng",
    desc: "Giảm ngay 5% khi chuyển khoản",
    icon: Landmark,
  },
  {
    id: "wallet" as const,
    title: "Thanh toán MoMo / ZaloPay",
    desc: "Nhanh chóng & bảo mật",
    icon: Wallet,
  },
  {
    id: "cod" as const,
    title: "Thanh toán khi nhận hoa (COD)",
    desc: "Áp dụng cho đơn dưới 2.000.000đ",
    icon: ShoppingBag,
  },
];

export const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  paymentMethod,
  onPaymentMethodChange,
}) => {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <CreditCard className="w-5 h-5 text-[#EE2B5B]" />
        <h2 className="text-[17px] font-bold text-gray-800">
          Phương thức thanh toán
        </h2>
      </div>

      {/* Payment Method Options */}
      <div className="flex flex-col gap-3">
        {PAYMENT_METHODS.map((item) => {
          const Icon = item.icon;
          const isSelected = paymentMethod === item.id;

          return (
            <React.Fragment key={item.id}>
              <label
                className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                  isSelected
                    ? "bg-[#FFF4F6] border-[#EE2B5B]"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
              {/* Radio Indicator */}
              <div className="flex-shrink-0 mr-4">
                <div
                  className={`flex items-center justify-center w-5 h-5 rounded-full transition-all duration-200 ${
                    isSelected
                      ? "border-[5px] border-[#EE2B5B] bg-white"
                      : "border border-gray-300 bg-transparent"
                  }`}
                />
              </div>

              {/* Hidden Radio Input */}
              <input
                type="radio"
                name="payment"
                checked={isSelected}
                onChange={() => onPaymentMethodChange(item.id)}
                className="hidden"
              />

              {/* Content */}
              <div className="flex-1">
                <p className="text-[15px] font-bold text-gray-800 leading-tight">
                  {item.title}
                </p>
                <p
                  className={`text-[13px] mt-1 transition-colors ${
                    isSelected ? "text-[#EE2B5B]/80 font-medium" : "text-gray-500"
                  }`}
                >
                  {item.desc}
                </p>
              </div>

              {/* Icon Right */}
              <div className="flex-shrink-0 ml-4">
                <Icon
                  className="w-[22px] h-[22px] text-gray-800"
                  strokeWidth={2}
                />
              </div>
            </label>

            {/* Bank Transfer Details (Show when selected) */}
          </React.Fragment>
          );
        })}
      </div>
    </section>
  );
};



import React from "react";
import { CreditCard, Banknote, Wallet, Truck } from "lucide-react";

interface PaymentMethodSectionProps {
 paymentMethod: "bank" | "wallet" | "cod";
 onPaymentMethodChange: (method: "bank" | "wallet" | "cod") => void;
}

// Dữ liệu các phương thức thanh toán
const PAYMENT_METHODS = [
 {
 id: "bank" as const,
 title: "Chuyển khoản ngân hàng",
 desc: "Giảm ngay 5% ưu đãi thanh toán sớm",
 icon: Banknote,
 },
 {
 id: "wallet" as const,
 title: "Ví điện tử MoMo / ZaloPay",
 desc: "Xác nhận đơn hàng nhanh chóng",
 icon: Wallet,
 },
 {
 id: "cod" as const,
 title: "Thanh toán khi nhận hoa (COD)",
 desc: "Áp dụng cho đơn hàng dưới 2 triệu đồng",
 icon: Truck,
 },
];

// Component hiển thị các phương thức thanh toán
export const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
 paymentMethod,
 onPaymentMethodChange,
}) => {
 return (
 <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200/60 ">
 {/* Header */}
 <div className="flex items-center gap-4 mb-8">
 <div className="p-3 bg-[#EE2B5B]/10 rounded-2xl">
 <CreditCard className="w-7 h-7 text-[#EE2B5B]" />
 </div>
 <h2 className="typo-heading-lg tracking-tight">
 Phương thức thanh toán
 </h2>
 </div>

 {/* Payment Method Options */}
 <div className="grid grid-cols-1 gap-4">
 {PAYMENT_METHODS.map((item) => {
 const Icon = item.icon;
 const isSelected = paymentMethod === item.id;

 return (
 <label
 key={item.id}
 className={`flex items-center gap-5 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
 isSelected
 ? "border-[#EE2B5B] bg-[#EE2B5B]/[0.02] shadow-md shadow-[#EE2B5B]/5"
 : "border-gray-100 hover:border-gray-200"
 }`}
 >
 {/* Custom Radio Button */}
 <div
 className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${
 isSelected
 ? "border-[#EE2B5B] bg-[#EE2B5B]"
 : "border-gray-300"
 }`}
 >
 {isSelected && (
 <div className="size-2 bg-white rounded-full"></div>
 )}
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
 <p className="typo-body-lg leading-tight">{item.title}</p>
 <p
 className={`typo-caption-xs mt-1 ${
 item.id === "bank"
 ? "text-[#EE2B5B] font-bold uppercase"
 : "text-gray-400"
 }`}
 >
 {item.desc}
 </p>
 </div>

 {/* Icon */}
 <Icon
 className={`w-8 h-8 opacity-20 hidden sm:block ${
 isSelected ? "text-[#EE2B5B] opacity-40" : ""
 }`}
 />
 </label>
 );
 })}
 </div>
 </section>
 );
};



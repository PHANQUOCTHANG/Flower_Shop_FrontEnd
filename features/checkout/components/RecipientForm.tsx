import React from "react";
import { Truck, MapPin, Calendar, Clock, Gift } from "lucide-react";

interface RecipientFormProps {
  recipientName: string;
  recipientPhone: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  giftMessage: string;
  onRecipientNameChange: (value: string) => void;
  onRecipientPhoneChange: (value: string) => void;
  onDeliveryAddressChange: (value: string) => void;
  onDeliveryDateChange: (value: string) => void;
  onDeliveryTimeChange: (value: string) => void;
  onGiftMessageChange: (value: string) => void;
}

// Component hiển thị form thông tin người nhận hàng
export const RecipientForm: React.FC<RecipientFormProps> = ({
  recipientName,
  recipientPhone,
  deliveryAddress,
  deliveryDate,
  deliveryTime,
  giftMessage,
  onRecipientNameChange,
  onRecipientPhoneChange,
  onDeliveryAddressChange,
  onDeliveryDateChange,
  onDeliveryTimeChange,
  onGiftMessageChange,
}) => {
  return (
    <section className="bg-white dark:bg-white/5 rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200/60 dark:border-white/10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-[#ee2b5b]/10 rounded-2xl">
          <Truck className="w-7 h-7 text-[#ee2b5b]" />
        </div>
        <div>
          <h2 className="typo-heading-lg tracking-tight">
            Thông tin người nhận
          </h2>
          <p className="typo-body-sm text-gray-400">
            Vui lòng điền chính xác thông tin để chúng tôi giao hoa đúng hẹn
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Tên người nhận & Điện thoại */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2.5">
            <label className="typo-label-sm text-gray-400 ml-1">
              Tên người nhận
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => onRecipientNameChange(e.target.value)}
              placeholder="Nhập họ và tên người nhận"
              className="w-full h-14 px-5 rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-transparent focus:border-[#ee2b5b] focus:ring-4 focus:ring-[#ee2b5b]/5 transition-all outline-none font-medium placeholder:text-gray-300"
            />
          </div>
          <div className="space-y-2.5">
            <label className="typo-label-sm text-gray-400 ml-1">
              Số điện thoại người nhận
            </label>
            <input
              type="tel"
              value={recipientPhone}
              onChange={(e) => onRecipientPhoneChange(e.target.value)}
              placeholder="Ví dụ: 0901 234 567"
              className="w-full h-14 px-5 rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-transparent focus:border-[#ee2b5b] focus:ring-4 focus:ring-[#ee2b5b]/5 transition-all outline-none font-medium placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* Địa chỉ giao hoa */}
        <div className="space-y-2.5">
          <label className="typo-label-sm text-gray-400 ml-1">
            Địa chỉ giao hoa
          </label>
          <div className="relative group">
            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#ee2b5b] transition-colors" />
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => onDeliveryAddressChange(e.target.value)}
              placeholder="Số nhà, tên đường, phường, quận..."
              className="w-full h-14 pl-14 pr-5 rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-transparent focus:border-[#ee2b5b] focus:ring-4 focus:ring-[#ee2b5b]/5 transition-all outline-none font-medium placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* Ngày giao & Khung giờ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2.5">
            <label className="typo-label-sm text-gray-400 ml-1">
              Ngày giao hoa
            </label>
            <div className="relative group">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#ee2b5b] transition-colors pointer-events-none" />
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => onDeliveryDateChange(e.target.value)}
                className="w-full h-14 pl-14 pr-5 rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-transparent focus:border-[#ee2b5b] focus:ring-4 focus:ring-[#ee2b5b]/5 transition-all outline-none font-medium"
              />
            </div>
          </div>
          <div className="space-y-2.5">
            <label className="typo-label-sm text-gray-400 ml-1">
              Khung giờ giao mong muốn
            </label>
            <div className="relative group">
              <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#ee2b5b] transition-colors pointer-events-none" />
              <select
                value={deliveryTime}
                onChange={(e) => onDeliveryTimeChange(e.target.value)}
                className="w-full h-14 pl-14 pr-5 rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-transparent focus:border-[#ee2b5b] focus:ring-4 focus:ring-[#ee2b5b]/5 transition-all outline-none font-medium appearance-none"
              >
                <option value="">Chọn khung giờ</option>
                <option value="morning">Sáng (08:00 - 12:00)</option>
                <option value="afternoon">Chiều (13:00 - 18:00)</option>
                <option value="evening">Tối (18:00 - 21:00)</option>
                <option value="fast">Giao nhanh ngay lập tức</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lời chúc trên thiệp */}
        <div className="space-y-2.5">
          <label className="typo-label-sm text-gray-400 ml-1 flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#ee2b5b]" />
            Lời chúc trên thiệp tặng kèm
          </label>
          <textarea
            rows={4}
            value={giftMessage}
            onChange={(e) => onGiftMessageChange(e.target.value)}
            placeholder="Ví dụ: Chúc mừng sinh nhật mẹ yêu! Chúc mẹ luôn xinh đẹp và hạnh phúc..."
            className="w-full p-5 rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-black/10 focus:border-[#ee2b5b] focus:ring-4 focus:ring-[#ee2b5b]/5 transition-all outline-none font-medium resize-none placeholder:text-gray-300"
          />
        </div>
      </div>
    </section>
  );
};

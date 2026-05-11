import React from "react";
import { Truck, MapPin, FileText } from "lucide-react";
import { AddressSelector } from "./index";
import type { Address } from "@/types/profile";

interface RecipientFormProps {
  shippingPhone: string;
  shippingAddress: string;
  name: string;
  note: string;
  errors?: Record<string, string>;
  selectedAddressId?: string;
  onShippingPhoneChange: (value: string) => void;
  onShippingAddressChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onAddressSelect: (address: Address) => void;
}

export const RecipientForm: React.FC<RecipientFormProps> = ({
  shippingPhone,
  shippingAddress,
  name,
  note,
  errors = {},
  selectedAddressId,
  onShippingPhoneChange,
  onShippingAddressChange,
  onNameChange,
  onNoteChange,
  onAddressSelect,
}) => {
  return (
    <section className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <Truck className="w-5 h-5 text-[#EE2B5B]" />
        <h2 className="text-[17px] font-bold text-gray-800">
          Thông tin giao hàng
        </h2>
      </div>

      <div className="space-y-6">
        {/* Chọn địa chỉ từ danh sách lưu trữ */}
        <AddressSelector
          selectedAddressId={selectedAddressId}
          onAddressSelect={onAddressSelect}
        />

        {/* Tên & Số điện thoại người nhận */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[13px] font-bold text-gray-700 mb-1.5 block">
              Tên người nhận
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Họ và tên của bạn"
              className={`w-full h-[48px] px-4 rounded-xl border bg-white transition-all outline-none text-[13.5px] placeholder:text-gray-400 ${
                errors.name
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-100 focus:border-[#EE2B5B]"
              }`}
            />
            {errors.name && (
              <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="text-[13px] font-bold text-gray-700 mb-1.5 block">
              Số điện thoại người nhận
            </label>
            <input
              type="tel"
              value={shippingPhone}
              onChange={(e) => onShippingPhoneChange(e.target.value)}
              placeholder="Ví dụ: 0901234567"
              className={`w-full h-[48px] px-4 rounded-xl border bg-white transition-all outline-none text-[13.5px] placeholder:text-gray-400 ${
                errors.shippingPhone
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-100 focus:border-[#EE2B5B]"
              }`}
            />
            {errors.shippingPhone && (
              <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.shippingPhone}</p>
            )}
          </div>
        </div>

        {/* Địa chỉ giao hàng */}
        <div>
          <label className="text-[13px] font-bold text-gray-700 mb-1.5 block">
            Địa chỉ giao hoa
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#EE2B5B]" />
            <input
              type="text"
              value={shippingAddress}
              onChange={(e) => onShippingAddressChange(e.target.value)}
              placeholder="Số nhà, tên đường, phường, quận..."
              className={`w-full h-[48px] pl-10 pr-4 rounded-xl border bg-white transition-all outline-none text-[13.5px] placeholder:text-gray-400 ${
                errors.shippingAddress
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-100 focus:border-[#EE2B5B]"
              }`}
            />
          </div>
          {errors.shippingAddress && (
            <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.shippingAddress}</p>
          )}
        </div>

        {/* Ghi chú đơn hàng */}
        <div>
          <label className="text-[13px] font-bold text-gray-700 mb-1.5 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#EE2B5B]" />
            Lời chúc trên thiệp
          </label>
          <textarea
            rows={4}
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Nhập lời nhắn yêu thương gửi đến người nhận tại đây..."
            className={`w-full p-4 rounded-xl border bg-[#F9F9F9] transition-all outline-none text-[13.5px] resize-none placeholder:text-gray-400 ${
              errors.note
                ? "border-red-400 focus:border-red-500"
                : "border-gray-100 focus:border-[#EE2B5B]"
            }`}
          />
          {errors.note && (
            <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.note}</p>
          )}
        </div>
      </div>
    </section>
  );
};


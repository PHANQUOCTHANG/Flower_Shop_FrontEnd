import React from "react";
import { Truck, MapPin, User, FileText } from "lucide-react";
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

// Component hiển thị form thông tin giao hàng
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
    <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Truck className="w-5 h-5 text-[#e91e63]" />
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          Thông tin giao hàng
        </h2>
      </div>

      <div className="space-y-8">
        {/* Chọn địa chỉ từ danh sách lưu trữ */}
        <AddressSelector
          selectedAddressId={selectedAddressId}
          onAddressSelect={onAddressSelect}
        />
        {/* Tên & Số điện thoại */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-[13px] font-bold text-gray-800 mb-2 block">
              Tên người nhận <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Họ và tên người nhận"
              className={`w-full h-[46px] px-4 rounded-xl border bg-white transition-all outline-none text-[13px] placeholder:text-gray-400 ${
                errors.name
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-200 focus:border-[#e91e63] focus:ring-2 focus:ring-[#e91e63]/10"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="text-[13px] font-bold text-gray-800 mb-2 block">
              Số điện thoại người nhận <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={shippingPhone}
              onChange={(e) => onShippingPhoneChange(e.target.value)}
              placeholder="Ví dụ: 0901234567"
              className={`w-full h-[46px] px-4 rounded-xl border bg-white transition-all outline-none text-[13px] placeholder:text-gray-400 ${
                errors.shippingPhone
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-200 focus:border-[#e91e63] focus:ring-2 focus:ring-[#e91e63]/10"
              }`}
            />
            {errors.shippingPhone && (
              <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.shippingPhone}</p>
            )}
          </div>
        </div>

        {/* Địa chỉ giao hàng */}
        <div>
          <label className="text-[13px] font-bold text-gray-800 mb-2 block">
            Địa chỉ giao hoa <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e91e63]" />
            <input
              type="text"
              value={shippingAddress}
              onChange={(e) => onShippingAddressChange(e.target.value)}
              placeholder="Số nhà, tên đường, phường, quận..."
              className={`w-full h-[46px] pl-10 pr-4 rounded-xl border bg-white transition-all outline-none text-[13px] placeholder:text-gray-400 ${
                errors.shippingAddress
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-200 focus:border-[#e91e63] focus:ring-2 focus:ring-[#e91e63]/10"
              }`}
            />
          </div>
          {errors.shippingAddress && (
            <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.shippingAddress}</p>
          )}
        </div>

        {/* Ghi chú đơn hàng */}
        <div>
          <label className="text-[13px] font-bold text-gray-800 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#e91e63]" />
            Lời chúc trên thiệp / Ghi chú
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Nhập lời nhắn yêu thương gửi đến người nhận tại đây..."
            className={`w-full p-4 rounded-xl border bg-[#fbfbfb] transition-all outline-none text-[13px] resize-none placeholder:text-gray-400 ${
              errors.note
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-gray-200 focus:border-[#e91e63] focus:ring-2 focus:ring-[#e91e63]/10"
            }`}
          />
          {errors.note && (
            <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.note}</p>
          )}
        </div>
      </div>
    </section>
  );
};

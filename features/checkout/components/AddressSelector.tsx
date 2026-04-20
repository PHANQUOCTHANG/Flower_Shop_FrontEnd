// Component hiển thị danh sách addresses theo hàng ngang
import React, { FC } from "react";
import { Loader, CheckCircle, MapPin } from "lucide-react";
import type { Address } from "@/types/profile";
import {
  useAddressesForCheckout,
  formatFullAddress,
} from "../hooks/useAddressesForCheckout";

interface AddressSelectorProps {
  selectedAddressId?: string;
  onAddressSelect: (address: Address) => void;
}

export const AddressSelector: FC<AddressSelectorProps> = ({
  selectedAddressId,
  onAddressSelect,
}) => {
  const { data: addresses = [], isLoading, error } = useAddressesForCheckout();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader size={18} className="animate-spin text-[#ee2b5b]" />
        <span className="ml-2 text-sm text-gray-600">Đang tải địa chỉ...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-3 rounded-2xl bg-red-50 border border-red-200">
        <p className="text-xs text-red-700 font-medium">
          ⚠️ Lỗi tải danh sách địa chỉ
        </p>
      </div>
    );
  }

  // Empty state - just render nothing, let user fill manually
  if (addresses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <label className="typo-label-sm text-gray-400 ml-1 flex items-center gap-2">
        <MapPin size={16} className="text-[#ee2b5b]" />
        Chọn từ địa chỉ lưu trữ
      </label>

      {/* Vertical scrollable list with max-height */}
      <div className="max-h-56 overflow-y-auto scrollbar-hide space-y-2">
        {addresses.map((address) => (
          <button
            key={address.id}
            onClick={() => onAddressSelect(address)}
            className={`w-full p-3 rounded-2xl border-2 transition-all text-left ${
              selectedAddressId === address.id
                ? "border-[#ee2b5b] bg-[#ee2b5b]/5"
                : "border-gray-100 bg-white hover:border-[#ee2b5b] hover:bg-gray-50"
            }`}
            type="button"
          >
            <div className="flex gap-3">
              {/* Checkbox */}
              <div className="shrink-0 mt-0.5">
                {selectedAddressId === address.id ? (
                  <CheckCircle
                    size={18}
                    className="text-[#ee2b5b]"
                    fill="currentColor"
                  />
                ) : (
                  <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-slate-900 text-sm truncate">
                    {address.name}
                  </p>
                  {address.isDefault && (
                    <span className="text-xs font-bold text-[#ee2b5b] bg-[#ee2b5b]/10 px-1.5 py-0.5 rounded">
                      Mặc định
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">{address.phone}</p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {formatFullAddress(address)}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Scrollbar hide style */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

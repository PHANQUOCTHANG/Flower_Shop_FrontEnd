import React, { FC } from "react";
import { Trash2, Edit3, CheckCircle2, Circle } from "lucide-react";
import type { Address } from "@/types/profile";

interface AddressCardProps {
  address: Address;
  isLoading?: boolean;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
}

export const AddressCard: FC<AddressCardProps> = ({
  address,
  isLoading = false,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  const fullAddress = `${address.streetDetail}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`;

  return (
    <div
      className={`bg-white border-2 rounded-lg sm:rounded-xl p-4 sm:p-5 transition-all hover:shadow-md ${
        address.isDefault
          ? "border-[#ee2b5b]/40 bg-[#ee2b5b]/3"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Header: Name and default badge */}
      <div className="flex items-start justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
            {address.name}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5 sm:mt-1 truncate">
            {address.phone}
          </p>
        </div>
        {address.isDefault && (
          <div className="shrink-0 px-2 sm:px-3 py-1 bg-[#ee2b5b]/10 text-[#ee2b5b] rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 whitespace-nowrap">
            <CheckCircle2 size={12} />
            <span className="hidden sm:inline">Mặc định</span>
            <span className="sm:hidden">MĐ</span>
          </div>
        )}
      </div>

      {/* Address detail */}
      <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-slate-50 rounded-lg">
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed line-clamp-2">
          {fullAddress}
        </p>
      </div>

      {/* Footer: Date and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-100">
        <p className="text-[11px] sm:text-xs text-slate-500 order-2 sm:order-1">
          Cập nhật: {new Date(address.updatedAt).toLocaleDateString("vi-VN")}
        </p>

        {/* Action buttons */}
        <div className="flex gap-1 sm:gap-2 order-1 sm:order-2">
          <button
            onClick={() => onEdit(address)}
            disabled={isLoading}
            title="Chỉnh sửa"
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            type="button"
          >
            <Edit3
              size={16}
              className="text-slate-400 group-hover:text-blue-500"
            />
          </button>
          <button
            onClick={() => onDelete(address.id)}
            disabled={isLoading}
            title="Xóa"
            className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            type="button"
          >
            <Trash2
              size={16}
              className="text-slate-400 group-hover:text-red-500"
            />
          </button>
          {!address.isDefault && (
            <button
              onClick={() => onSetDefault(address.id)}
              disabled={isLoading}
              title="Đặt làm mặc định"
              className="p-2 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              type="button"
            >
              <Circle
                size={16}
                className="text-slate-400 group-hover:text-amber-500"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

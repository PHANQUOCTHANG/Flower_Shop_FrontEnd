import React from "react";
import { Minus, Plus, Zap } from "lucide-react";

interface ActionButtonsProps {
  quantity: number;
  onQuantityChange: (type: "inc" | "dec") => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  quantity,
  onQuantityChange,
}) => {
  return (
    <div className="mt-auto space-y-4">
      {/* Số lượng và nút thêm giỏ */}
      <div className="flex flex-col sm:flex-row items-stretch gap-4">
        {/* Input số lượng */}
        <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden h-14 bg-white dark:bg-white/5">
          <button
            onClick={() => onQuantityChange("dec")}
            className="px-5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors h-full"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            value={quantity}
            readOnly
            className="w-12 text-center border-none bg-transparent focus:ring-0 typo-body font-bold"
          />
          <button
            onClick={() => onQuantityChange("inc")}
            className="px-5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors h-full"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Nút thêm giỏ */}
        <button className="flex-1 h-14 border-2 border-[#13ec5b] text-[#13ec5b] typo-button rounded-xl hover:bg-[#13ec5b] hover:text-[#0d1b12] transition-all transform active:scale-95">
          THÊM VÀO GIỎ
        </button>
      </div>

      {/* Nút đặt hoa ngay */}
      <button className="w-full bg-[#13ec5b] hover:bg-[#13ec5b]/90 text-[#0d1b12] typo-button-lg py-5 rounded-xl transition-all shadow-xl shadow-[#13ec5b]/20 flex items-center justify-center gap-3 transform active:scale-[0.98]">
        <Zap className="w-6 h-6 fill-[#0d1b12]" />
        ĐẶT HOA NGAY
      </button>
    </div>
  );
};

import React from "react";

interface PromoCodeProps {
  promoCode: string;
  onPromoCodeChange: (value: string) => void;
  onApply: () => void;
}

export const PromoCode: React.FC<PromoCodeProps> = ({
  promoCode,
  onPromoCodeChange,
  onApply,
}) => {
  return (
    <div className=" bg-[#ee2b5b]/5 dark:bg-[#ee2b5b]/10 rounded-xl border border-[#ee2b5b]/20 p-3 sm:p-4">
      <p className="typo-caption-xs text-[#9a4c5f] dark:text-white/80 mb-2 text-center">
        Có mã giảm giá?
      </p>
      <div className="flex flex-col sm:flex-row gap-1.5">
        <input
          type="text"
          value={promoCode}
          onChange={(e) => onPromoCodeChange(e.target.value)}
          placeholder="MÃ"
          className="flex-1 bg-white dark:bg-zinc-900 border border-[#ee2b5b]/20 rounded-lg px-3 py-2 text-xs uppercase focus:ring-1 focus:ring-[#ee2b5b] outline-none transition-all"
        />
        <button
          onClick={onApply}
          className="bg-[#ee2b5b] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#ee2b5b]/80 transition-colors whitespace-nowrap"
        >
          ÁP DỤNG
        </button>
      </div>
    </div>
  );
};

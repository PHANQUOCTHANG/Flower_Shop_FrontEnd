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
 <div className="bg-[#fce4ec]/50 rounded-xl p-5 mb-6">
 <p className="text-[11px] text-gray-500 mb-3 text-center font-medium">
 Bạn có mã giảm giá?
 </p>
 <div className="flex gap-2">
 <input
 type="text"
 value={promoCode}
 onChange={(e) => onPromoCodeChange(e.target.value)}
 placeholder="Mã KM"
 className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-3 text-xs uppercase focus:border-[#e91e63] outline-none transition-all placeholder:text-gray-400"
 />
 <button
 onClick={onApply}
 className="bg-[#e91e63] text-white px-5 py-3 rounded-lg text-xs font-bold hover:bg-[#db2777] transition-colors whitespace-nowrap active:scale-95"
 >
 Áp dụng
 </button>
 </div>
 </div>
 );
};



import React from "react";
import { MessageSquareQuote } from "lucide-react";

interface GiftCardProps {
 includeCard: boolean;
 cardMessage: string;
 onIncludeCardChange: (value: boolean) => void;
 onCardMessageChange: (value: string) => void;
}

export const GiftCard: React.FC<GiftCardProps> = ({
 includeCard,
 cardMessage,
 onIncludeCardChange,
 onCardMessageChange,
}) => {
 return (
 <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 mb-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
 <div className="flex items-center gap-2">
 <label className="flex items-center gap-3 cursor-pointer group">
 <div className="relative flex items-center justify-center">
 <input
 type="checkbox"
 checked={includeCard}
 onChange={(e) => onIncludeCardChange(e.target.checked)}
 className="peer appearance-none w-4 h-4 border border-gray-300 rounded hover:border-[#13ec5b] checked:bg-[#13ec5b] checked:border-[#13ec5b] transition-all"
 />
 <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
 </div>
 <span className="text-sm font-bold text-gray-900">Thêm thiệp/Lời nhắn miễn phí</span>
 </label>
 </div>

 {includeCard && (
 <div className="animate-in slide-in-from-top-2 duration-300">
 <textarea
 value={cardMessage}
 onChange={(e) => onCardMessageChange(e.target.value)}
 rows={3}
 placeholder="Viết lời nhắn gửi đến người nhận..."
 className="w-full bg-[#fff] border border-[#13ec5b]/20 rounded-xl p-4 text-[13px] focus:border-[#13ec5b] outline-none transition-all resize-none placeholder:text-gray-300"
 />
 </div>
 )}
 </div>
 );
};



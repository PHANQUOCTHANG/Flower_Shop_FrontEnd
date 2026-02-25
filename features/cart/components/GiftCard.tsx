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
    <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#e7cfd5] dark:border-white/10 p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="size-8 sm:size-10 rounded-full bg-[#ee2b5b]/10 flex items-center justify-center shrink-0">
            <MessageSquareQuote className="w-4 h-4 sm:w-5 h-5 text-[#ee2b5b]" />
          </div>
          <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={includeCard}
                onChange={(e) => onIncludeCardChange(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-8 sm:w-10 h-5 sm:h-6 bg-gray-200 dark:bg-white/10 rounded-full peer-checked:bg-[#ee2b5b] transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-3 after:w-3 sm:after:h-4 sm:after:w-4 after:transition-all peer-checked:after:translate-x-3 sm:peer-checked:after:translate-x-4"></div>
            </div>
            <span className="typo-button">Thiệp lời nhắn miễn phí</span>
          </label>
        </div>
        <span className="text-[10px] font-black uppercase text-green-500 tracking-widest bg-green-500/10 px-2 py-1 rounded">
          FREE
        </span>
      </div>

      {includeCard && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          <textarea
            value={cardMessage}
            onChange={(e) => onCardMessageChange(e.target.value)}
            rows={3}
            placeholder="Hãy viết những lời chúc yêu thương của bạn tại đây..."
            className="w-full bg-[#fcf8f9] dark:bg-black/20 border border-[#e7cfd5] dark:border-white/20 rounded-xl p-3 sm:p-4 text-sm focus:ring-2 focus:ring-[#ee2b5b]/50 focus:border-[#ee2b5b] outline-none transition-all"
          />
        </div>
      )}
    </div>
  );
};

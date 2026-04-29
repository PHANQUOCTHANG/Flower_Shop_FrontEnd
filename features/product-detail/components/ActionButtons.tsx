import React from "react";
import { Minus, Plus, Zap, Phone } from "lucide-react";

interface ActionButtonsProps {
 quantity: number;
 onQuantityChange: (type: "inc" | "dec") => void;
 onAddToCart: (quantity: number) => void;
 isLoading?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
 quantity,
 onQuantityChange,
 onAddToCart,
 isLoading = false,
}) => {
 // Xử lý thêm vào giỏ
 const handleAddToCart = () => {
 onAddToCart(quantity);
 };

 return (
 <>
 <div className="mt-auto space-y-4">
 {/* Số lượng và nút thêm giỏ */}
 <div className="flex flex-col sm:flex-row items-stretch gap-4">
 {/* Input số lượng */}
 <div className="flex items-center justify-between border border-gray-200 rounded-full overflow-hidden h-[46px] bg-white w-full sm:w-28 px-1">
 <button
 onClick={() => onQuantityChange("dec")}
 className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-50 text-gray-500"
 disabled={isLoading}
 >
 <Minus className="w-3.5 h-3.5" />
 </button>
 <input
 type="number"
 value={quantity}
 readOnly
 className="w-8 text-center border-none bg-transparent focus:ring-0 text-sm font-bold p-0 text-gray-800"
 />
 <button
 onClick={() => onQuantityChange("inc")}
 className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-50 text-gray-500"
 disabled={isLoading}
 >
 <Plus className="w-3.5 h-3.5" />
 </button>
 </div>

 {/* Nút thêm giỏ */}
 <button
 onClick={handleAddToCart}
 disabled={isLoading}
 className="flex-1 h-[46px] border-2 border-[#13ec5b] text-[#13ec5b] text-[13px] font-bold rounded-full hover:bg-[#13ec5b] hover:text-[#0d1b12] transition-all transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
 >
 {isLoading ? "Đang thêm..." : "THÊM VÀO GIỎ"}
 </button>
 </div>

 {/* Nút đặt hoa ngay (Desktop) */}
 <button
 disabled={isLoading}
 className="hidden sm:flex w-full bg-[#13ec5b] hover:bg-[#0ecf50] text-[#0d1b12] text-sm py-[14px] rounded-full transition-all hover:shadow-lg items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed font-black"
 >
 <Zap className="w-4 h-4 fill-current" />
 ĐẶT HOA NGAY
 </button>

 {/* Đặt hoa qua SDDT và Zalo */}
 <div className="grid grid-cols-2 gap-3">
 <div className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-[#0d1b12] py-3 rounded-xl">
 <Phone className="w-5 h-5 text-[#13ec5b]" />
 <span className="typo-body-sm font-semibold">0931838465</span>
 </div>
 <a
 href="https://zalo.me/0931838465"
 target="_blank"
 rel="noopener noreferrer"
 className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-[#0d1b12] py-3 rounded-xl hover:bg-gray-50 transition-all"
 >
 <svg
 className="w-5 h-5 text-[#13ec5b]"
 viewBox="0 0 24 24"
 fill="currentColor"
 xmlns="http://www.w3.org/2000/svg"
 >
 <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm-3 8.5c0 .828-.672 1.5-1.5 1.5S6 9.328 6 8.5 6.672 7 7.5 7 9 7.672 9 8.5zm6 0c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5zm3 6c0 1.657-2.239 3-5 3s-5-1.343-5-3V12h10v2z" />
 </svg>
 <span className="typo-body-sm font-semibold">Đặt qua Zalo</span>
 </a>
 </div>
 </div>

 {/* Mobile Sticky Button */}
 <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] sm:hidden z-50 animate-slide-in-up">
 <button
 disabled={isLoading}
 className="w-full bg-[#13ec5b] text-[#0d1b12] text-sm py-[14px] rounded-full shadow-lg shadow-[#13ec5b]/30 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-60 transition-all font-black"
 >
 <Zap className="w-4 h-4 fill-current" />
 ĐẶT HOA NGAY
 </button>
 </div>
 </>
 );
};



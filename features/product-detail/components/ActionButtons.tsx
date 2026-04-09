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
 <div className="mt-auto space-y-4">
 {/* Số lượng và nút thêm giỏ */}
 <div className="flex flex-col sm:flex-row items-stretch gap-4">
 {/* Input số lượng */}
 <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-14 bg-white ">
 <button
 onClick={() => onQuantityChange("dec")}
 className="px-5 hover:bg-gray-100 transition-colors h-full disabled:opacity-50"
 disabled={isLoading}
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
 className="px-5 hover:bg-gray-100 transition-colors h-full disabled:opacity-50"
 disabled={isLoading}
 >
 <Plus className="w-4 h-4" />
 </button>
 </div>

 {/* Nút thêm giỏ */}
 <button
 onClick={handleAddToCart}
 disabled={isLoading}
 className="flex-1 h-14 border-2 border-[#13ec5b] text-[#13ec5b] typo-button rounded-xl hover:bg-[#13ec5b] hover:text-[#0d1b12] transition-all transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
 >
 {isLoading ? "Đang thêm..." : "THÊM VÀO GIỎ"}
 </button>
 </div>

 {/* Nút đặt hoa ngay */}
 <button
 disabled={isLoading}
 className="w-full bg-[#13ec5b] hover:bg-[#13ec5b]/90 text-[#0d1b12] typo-button-lg py-5 rounded-xl transition-all shadow-xl shadow-[#13ec5b]/20 flex items-center justify-center gap-3 transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
 >
 <Zap className="w-6 h-6 fill-[#0d1b12]" />
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
 );
};



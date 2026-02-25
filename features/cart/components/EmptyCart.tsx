import React from "react";
import { ShoppingCart } from "lucide-react";

export const EmptyCart: React.FC = () => {
  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl border-2 border-dashed border-[#e7cfd5] dark:border-white/10 p-10 sm:p-16 text-center">
      <div className="size-16 sm:size-20 bg-[#ee2b5b]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShoppingCart className="w-8 h-8 sm:w-10 h-10 text-[#ee2b5b]" />
      </div>
      <h3 className="typo-heading-md mb-2">Giỏ hàng đang trống</h3>
      <p className="typo-body text-[#9a4c5f] dark:text-white/60 mb-6 px-4">
        Hãy quay lại trang sản phẩm để chọn những bó hoa ưng ý nhất.
      </p>
      <button className="bg-[#ee2b5b] text-white px-6 sm:px-8 py-3 rounded-xl typo-button-sm hover:shadow-lg transition-all">
        Khám phá sản phẩm
      </button>
    </div>
  );
};

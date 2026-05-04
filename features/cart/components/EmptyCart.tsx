import React from "react";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export const EmptyCart: React.FC = () => {
 return (
 <div className="bg-white rounded-2xl border-2 border-dashed border-[#cce7d4] p-10 sm:p-16 text-center">
 <div className="size-16 sm:size-20 bg-[#EE2B5B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
 <ShoppingCart className="w-8 h-8 sm:w-10 h-10 text-[#EE2B5B]" />
 </div>
 <h3 className="typo-heading-md mb-2">Giỏ hàng đang trống</h3>
 <p className="typo-body text-black mb-6 px-4">
 Hãy quay lại trang sản phẩm để chọn những bó hoa ưng ý nhất.
 </p>
 <button className="bg-[#EE2B5B] text-white px-6 sm:px-8 py-3 rounded-xl typo-button-sm hover:shadow-lg transition-all">
 <Link href="/products">Khám phá sản phẩm</Link>
 </button>
 </div>
 );
};



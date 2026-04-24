import React from "react";
import { Info } from "lucide-react";
import { Product } from "../types";

interface DescriptionTabProps {
 product: Product;
}

export const DescriptionTab: React.FC<DescriptionTabProps> = ({ product }) => {
 return (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
 {/* Bên trái */}
 <div className="space-y-6">
 {/* Mô tả chi tiết (HTML) */}
 {product.description && (
 <div className="space-y-2">
 <h4 className="typo-heading-sm flex items-center gap-2">
 <Info className="w-5 h-5 text-[#13ec5b]" />
 Về mẫu hoa này
 </h4>
 <div
 className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
 dangerouslySetInnerHTML={{ __html: product.description }}
 />
 </div>
 )}
 </div>

 {/* Bên phải - Lưu ý bảo quản
 <div className="bg-[#13ec5b]/5 rounded-2xl p-6 border border-[#13ec5b]/10 h-fit">
 <h4 className="typo-heading-md mb-4">Lưu ý bảo quản:</h4>
 <ul className="space-y-3 typo-body-sm text-gray-600">
 <li className="flex gap-2">
 <span className="text-[#13ec5b]">•</span>
 Để hoa nơi thoáng mát, tránh ánh nắng trực tiếp hoặc gió điều hòa
 mạnh.
 </li>
 <li className="flex gap-2">
 <span className="text-[#13ec5b]">•</span>
 Thay nước sạch cho hoa mỗi 1-2 ngày một lần.
 </li>
 <li className="flex gap-2">
 <span className="text-[#13ec5b]">•</span>
 Cắt bớt gốc hoa theo chiều chéo khi thay nước để hoa hút nước tốt
 hơn.
 </li>
 </ul>
 </div> */}
 </div>
 );
};



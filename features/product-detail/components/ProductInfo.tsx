import React from "react";
import { Product } from "../types";
import { formatCurrency } from "../../../utils/format";

interface ProductInfoProps {
 product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
 const discount = product.comparePrice
 ? Math.round(
 ((product.comparePrice - product.price) / product.comparePrice) * 100,
 )
 : 0;

 return (
 <div className="flex flex-col">
 {/* Tiêu đề */}
 <div className="mb-4">
 <h2 className="text-3xl font-black text-gray-900 mb-2">{product.name}</h2>
 <p className="text-sm text-gray-500">
 {product.shortDescription || product.description || "Hoa ly trắng kết hợp cùng hơi thở của em bé cho vẻ đẹp cổ điển."}
 </p>
 </div>

 {/* Giá */}
 <div className="mb-8">
 <div className="inline-flex items-center px-4 py-2 bg-[#13ec5b]/10 rounded-xl">
 <p className="text-2xl font-black text-[#13ec5b]">
 {formatCurrency(product.price)}
 </p>
 {product.comparePrice && (
 <span className="text-sm text-gray-400 line-through font-medium ml-3">
 {formatCurrency(product.comparePrice)}
 </span>
 )}
 </div>
 </div>

 {/* Mô tả */}
 {/* <div className="mb-6">
 <p className="typo-subtitle">
 {product.shortDescription}
 </p>
 </div> */}
 </div>
 );
};



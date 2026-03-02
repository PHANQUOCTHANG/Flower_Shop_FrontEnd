import React from "react";
import { Flower2 } from "lucide-react";
import { Product } from "../types";
import { formatCurrency } from "../../../utils/format";

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const composition = product.composition || [];
  const discount = product.comparePrice
    ? Math.round(
        ((Number(product.comparePrice) - Number(product.price)) /
          Number(product.comparePrice)) *
          100,
      )
    : 0;

  return (
    <div className="flex flex-col">
      {/* Tiêu đề và mô tả */}
      <div className="mb-6">
        <h2 className="typo-heading-xl mb-3">{product.name}</h2>
        <p className="typo-subtitle">
          {product.shortDescription || product.description}
        </p>
      </div>

      {/* Giá */}
      <div className="mb-8 p-6 bg-[#13ec5b]/10 rounded-2xl inline-block self-start border border-[#13ec5b]/20">
        <div className="flex items-center gap-3">
          <p className="typo-display-md text-[#13ec5b]">
            {formatCurrency(product.price)}
          </p>
          {product.comparePrice && (
            <>
              <p className="typo-body-sm text-gray-400 line-through">
                {formatCurrency(product.comparePrice)}
              </p>
              {discount > 0 && (
                <span className="typo-caption-xs px-3 py-1 bg-[#e91e63] text-white rounded-full">
                  -{discount}%
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Thành phần */}
      {composition.length > 0 && (
        <div className="space-y-8 mb-10">
          <div>
            <h3 className="typo-heading-sm mb-4 flex items-center gap-2">
              <Flower2 className="w-5 h-5 text-[#13ec5b]" />
              Thành phần chính
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 typo-body-sm text-gray-600">
              {composition.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#13ec5b] shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

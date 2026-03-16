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
      <div className="mb-6">
        <h2 className="typo-heading-xl mb-3">{product.name}</h2>
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

      {/* Mô tả */}
      <div className="mb-6">
        <p className="typo-subtitle">
          {product.shortDescription || product.description}
        </p>
      </div>
    </div>
  );
};

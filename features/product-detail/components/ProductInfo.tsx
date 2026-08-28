import React from "react";
import { Product } from "../types";
import { formatCurrency } from "../../../utils/format";
import { Star, Tag } from "lucide-react";

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(
          ((product.comparePrice - product.price) / product.comparePrice) * 100,
        )
      : 0;

  // Giá hiển thị: ưu tiên salePrice từ campaign, sau đó mới dùng giá gốc
  const displayPrice = product.salePrice ?? product.price;
  const isCampaignSale = !!product.salePrice && product.salePrice < product.price;
  const campaignDiscount = isCampaignSale
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const categoryName = product.categories?.[0]?.name;

  return (
    <div className="flex flex-col gap-5">
      {/* Category tag */}
      {categoryName && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-500 text-xs font-semibold tracking-wide">
            <Tag className="w-3 h-3" />
            {categoryName}
          </span>
        </div>
      )}

      {/* Tên sản phẩm */}
      <div>
        <h1 className="text-3xl xl:text-4xl font-black text-gray-900 leading-tight tracking-tight">
          {product.name}
        </h1>

        {/* SKU chip */}
        {product.sku && (
          <div className="mt-2 inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 border border-gray-200">
            <span className="text-[11px] text-gray-400 font-mono tracking-wider">
              Mã: {product.sku}
            </span>
          </div>
        )}
      </div>

      {/* Rating placeholder */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className="w-4 h-4 fill-amber-400 text-amber-400"
              strokeWidth={0}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500 font-medium">5.0</span>
        <span className="text-gray-300 text-sm">·</span>
        <span className="text-sm text-gray-400">Đã bán 200+</span>
      </div>

      {/* Giá */}
      <div className="flex items-end gap-3 py-4 border-t border-b border-gray-100">
        <p className="text-4xl font-black text-[#0ecf50] tracking-tight">
          {formatCurrency(displayPrice)}
        </p>
        {/* Giá gốc gạch ngang khi có campaign sale */}
        {isCampaignSale && (
          <>
            <span className="text-lg text-gray-300 line-through font-medium mb-0.5">
              {formatCurrency(product.price)}
            </span>
            <span className="mb-1 inline-flex items-center px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold shadow-sm">
              -{campaignDiscount}%
            </span>
          </>
        )}
        {/* comparePrice (giảm giá thường) chỉ hiển thị khi không có campaign */}
        {!isCampaignSale && product.comparePrice && product.comparePrice > product.price && (
          <>
            <span className="text-lg text-gray-300 line-through font-medium mb-0.5">
              {formatCurrency(product.comparePrice)}
            </span>
            <span className="mb-1 inline-flex items-center px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold shadow-sm">
              -{discount}%
            </span>
          </>
        )}
      </div>

      {/* Mô tả ngắn */}
      {(product.shortDescription || product.description) && (
        <div
          className="text-[15px] text-gray-500 leading-relaxed prose prose-sm max-w-none prose-p:my-1"
          dangerouslySetInnerHTML={{
            __html:
              product.shortDescription ||
              product.description ||
              "",
          }}
        />
      )}
    </div>
  );
};

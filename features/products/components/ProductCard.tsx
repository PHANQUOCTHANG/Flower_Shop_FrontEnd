/* eslint-disable @next/next/no-img-element */
import { Product } from "@/features/products/types";
import { Bolt, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export const ProductCard = ({
  product,
  viewMode = "grid",
}: {
  product: Product;
  viewMode?: "grid" | "list";
}) => {
  const router = useRouter();

  // Tính discount từ comparePrice
  const discount = product.comparePrice
    ? Math.round(
        ((parseFloat(String(product.comparePrice)) -
          parseFloat(String(product.price))) /
          parseFloat(String(product.comparePrice))) *
          100,
      )
    : 0;

  // Tính trạng thái hàng
  const isLowStock =
    product.stockQuantity > 0 &&
    product.lowStockThreshold &&
    product.stockQuantity <= product.lowStockThreshold;
  const isOutOfStock = product.stockQuantity === 0;

  if (viewMode === "list") {
    return (
      <div
        onClick={() => router.push(`/products/${product.slug}`)}
        className="flex gap-6 bg-white dark:bg-white/5 rounded-4xl overflow-hidden border border-transparent hover:border-[#13ec5b]/20 hover:shadow-2xl transition-all duration-500 p-6 cursor-pointer"
      >
        {/* Hình ảnh */}
        <div className="relative w-32 h-40 shrink-0 overflow-hidden rounded-2xl">
          {discount > 0 && (
            <div className="absolute top-3 left-3 z-10 text-white typo-caption-xs px-3 py-1.5 rounded-full shadow-lg bg-[#e91e63]">
              -{discount}%
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center">
              <span className="typo-button-sm text-white">Hết hàng</span>
            </div>
          )}
          {isLowStock && (
            <div className="absolute top-3 right-3 z-10 text-white typo-caption-xs px-3 py-1.5 rounded-full shadow-lg bg-[#ff9800]">
              Sắp hết
            </div>
          )}
          <button className="absolute top-3 right-3 z-10 size-8 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-md flex items-center justify-center text-gray-600 dark:text-white hover:text-[#e91e63] transition-all active:scale-90">
            <Heart size={16} />
          </button>
          <img
            src={product.thumbnailUrl || undefined}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
          />
        </div>
        {/* Thông tin */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="typo-body text-[#0d1b12] dark:text-white mb-2 hover:text-[#13ec5b] transition-colors line-clamp-2">
              {product.name}
            </h3>
            {product.shortDescription && (
              <p className="typo-caption-sm text-[#4c9a66] dark:text-white/60 mb-3 line-clamp-2">
                {product.shortDescription}
              </p>
            )}
            <div className="flex items-center gap-3">
              <p className="typo-heading-md text-[#e91e63]">
                {parseInt(String(product.price)).toLocaleString("vi-VN")}đ
              </p>
              {product.comparePrice && (
                <p className="typo-caption-sm text-[#ccc] line-through">
                  {parseInt(String(product.comparePrice)).toLocaleString(
                    "vi-VN",
                  )}
                  đ
                </p>
              )}
            </div>
          </div>
          <button
            disabled={isOutOfStock}
            className="w-[200px] bg-[#e91e63] hover:bg-[#db2777] disabled:bg-gray-400 disabled:cursor-not-allowed text-white typo-button-sm py-3 rounded-2xl transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Bolt size={18} fill="currentColor" />
            {isOutOfStock ? "HẾT HÀNG" : "MUA NGAY"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => router.push(`/products/${product.slug}`)}
      className="group flex flex-col bg-white dark:bg-white/5 rounded-4xl overflow-hidden border border-transparent hover:border-[#13ec5b]/20 hover:shadow-2xl transition-all duration-500 cursor-pointer"
    >
      <div className="relative aspect-4/5 overflow-hidden">
        {discount > 0 && (
          <div className="absolute top-5 left-5 z-10 text-white typo-caption-xs px-3 py-1.5 rounded-full shadow-lg bg-[#e91e63]">
            -{discount}%
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center">
            <span className="typo-button-sm text-white">Hết hàng</span>
          </div>
        )}
        {isLowStock && (
          <div className="absolute top-5 right-5 z-10 text-white typo-caption-xs px-3 py-1.5 rounded-full shadow-lg bg-[#ff9800]">
            Sắp hết
          </div>
        )}
        <button className="absolute top-5 right-5 z-10 size-10 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-md flex items-center justify-center text-gray-600 dark:text-white hover:text-[#e91e63] transition-all active:scale-90">
          <Heart size={20} />
        </button>
        <img
          src={product.thumbnailUrl || undefined}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-col gap-2 mb-6">
          <h3 className="typo-body text-[#0d1b12] dark:text-white group-hover:text-[#13ec5b] transition-colors line-clamp-2">
            {product.name}
          </h3>
          {product.shortDescription && (
            <p className="typo-caption-sm text-[#4c9a66] dark:text-white/60 line-clamp-2">
              {product.shortDescription}
            </p>
          )}
          <div className="flex items-center gap-2 pt-2">
            <p className="typo-heading-md text-[#e91e63]">
              {parseInt(String(product.price)).toLocaleString("vi-VN")}đ
            </p>
            {product.comparePrice && (
              <p className="typo-caption-sm text-[#ccc] line-through">
                {parseInt(String(product.comparePrice)).toLocaleString("vi-VN")}
                đ
              </p>
            )}
          </div>
        </div>
        <button
          disabled={isOutOfStock}
          className="mt-auto w-full bg-[#e91e63] hover:bg-[#db2777] disabled:bg-gray-400 disabled:cursor-not-allowed text-white typo-button-sm py-4 rounded-2xl transition-all transform active:scale-95 flex items-center justify-center gap-2"
        >
          <Bolt size={18} fill="currentColor" />
          {isOutOfStock ? "HẾT HÀNG" : "MUA NGAY"}
        </button>
      </div>
    </div>
  );
};

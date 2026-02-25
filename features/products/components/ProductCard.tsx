/* eslint-disable @next/next/no-img-element */
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

  if (viewMode === "list") {
    return (
      <>
          <div
            onClick={() => router.push(`/products/${product.id}`)}
            className="flex gap-6 bg-white dark:bg-white/5 rounded-4xl overflow-hidden border border-transparent hover:border-[#13ec5b]/20 hover:shadow-2xl transition-all duration-500 p-6 cursor-pointer"
          >
            {/* Hình ảnh */}
            <div className="relative w-32 h-40 shrink-0 overflow-hidden rounded-2xl">
              {product.badge && (
                <div
                  className={`absolute top-3 left-3 z-10 text-white typo-caption-xs px-3 py-1.5 rounded-full shadow-lg ${
                    product.badgeType === "hot"
                      ? "bg-[#e91e63]"
                      : "bg-[#13ec5b] text-[#0d1b12]"
                  }`}
                >
                  {product.badge}
                </div>
              )}
              <button className="absolute top-3 right-3 z-10 size-8 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-md flex items-center justify-center text-gray-600 dark:text-white hover:text-[#e91e63] transition-all active:scale-90">
                <Heart size={16} />
              </button>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
              />
            </div>
            {/* Thông tin */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="typo-body text-[#0d1b12] dark:text-white mb-2 hover:text-[#13ec5b] transition-colors">
                  {product.name}
                </h3>
                <p className="typo-heading-md text-[#e91e63] mb-4">
                  {product.price.toLocaleString("vi-VN")}đ
                </p>
              </div>
              <button className="w-[200px] bg-[#e91e63] hover:bg-[#db2777] text-white typo-button-sm py-3 rounded-2xl transition-all transform active:scale-95 flex items-center justify-center gap-2">
                <Bolt size={18} fill="currentColor" />
                MUA NGAY
              </button>
            </div>
          </div>
      </>
    );
  }

  return (
    <div
      onClick={() => router.push(`/products/${product.id}`)}
      className="group flex flex-col bg-white dark:bg-white/5 rounded-4xl overflow-hidden border border-transparent hover:border-[#13ec5b]/20 hover:shadow-2xl transition-all duration-500 cursor-pointer"
    >
      <div className="relative aspect-4/5 overflow-hidden">
        {product.badge && (
          <div
            className={`absolute top-5 left-5 z-10 text-white typo-caption-xs px-3 py-1.5 rounded-full shadow-lg ${
              product.badgeType === "hot"
                ? "bg-[#e91e63]"
                : "bg-[#13ec5b] text-[#0d1b12]"
            }`}
          >
            {product.badge}
          </div>
        )}
        <button className="absolute top-5 right-5 z-10 size-10 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-md flex items-center justify-center text-gray-600 dark:text-white hover:text-[#e91e63] transition-all active:scale-90">
          <Heart size={20} />
        </button>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-col gap-1 mb-6">
          <h3 className="typo-body text-[#0d1b12] dark:text-white group-hover:text-[#13ec5b] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="typo-heading-md text-[#e91e63]">
            {product.price.toLocaleString("vi-VN")}đ
          </p>
        </div>
        <button className="mt-auto w-full bg-[#e91e63] hover:bg-[#db2777] text-white typo-button-sm py-4 rounded-2xl transition-all transform active:scale-95 flex items-center justify-center gap-2">
          <Bolt size={18} fill="currentColor" />
          MUA NGAY
        </button>
      </div>
    </div>
  );
};

/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ShoppingCart } from "lucide-react";
import { SimilarProduct } from "../types";
import { formatCurrency } from "../../../utils/format";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SimilarProductsProps {
  products: SimilarProduct[];
  category: string 
}

export const SimilarProducts: React.FC<SimilarProductsProps> = ({
  products = [],
  category
}) => {

  const router = useRouter();
  return (
    <section className="pt-12 border-t border-gray-200 ">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="typo-heading-xl">Sản phẩm tương tự</h2>
          <p className="typo-subtitle mt-1">
            Gợi ý những mẫu hoa tinh tế khác dành cho bạn
          </p>
        </div>
        <Link href={`/products?category=${category}`}>
            <button className="text-[#13ec5b] typo-button-sm hover:underline mb-1">
              Xem tất cả
            </button>
        </Link>
      </div>

      {/* Grid sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {products.map((item) => (
          <div onClick={() => router.push(`${item.slug}`)} key={item.id} className="group cursor-pointer">
            {/* Hình ảnh */}
            <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-white relative shadow-sm border border-gray-100 ">
              <img
                src={
                  item.thumbnailUrl ||
                  item.images?.[0]?.url ||
                  "/placeholder.jpg"
                }
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <button className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-lg text-[#13ec5b]">
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>

            {/* Thông tin */}
            <h3 className="typo-body text-gray-900 mb-1 group-hover:text-[#13ec5b] transition-colors line-clamp-1">
              {item.name}
            </h3>
            <p className="text-[#13ec5b] typo-heading-sm">
              {formatCurrency(item.price)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

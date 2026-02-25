"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  badgeType?: "discount" | "new" | "hot";
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  showControls?: boolean;
}

export default function ProductSection({
  title,
  products,
  showControls = false,
}: ProductSectionProps) {
  const router = useRouter();

  // Điều hướng tới trang sản phẩm
  const handleViewAll = () => {
    router.push("/products");
  };

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8 px-2">
        <h3 className="typo-heading-lg">{title}</h3>
        <div className="flex items-center gap-4">
          {showControls && (
            <div className="flex gap-2 hidden sm:flex">
              <button className="size-10 rounded-full border border-[#e7f3eb] flex items-center justify-center hover:bg-[#13ec5b]/10 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button className="size-10 rounded-full border border-[#e7f3eb] flex items-center justify-center hover:bg-[#13ec5b]/10 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
          <button
            onClick={handleViewAll}
            className="text-[#13ec5b] typo-button-sm hover:underline flex items-center gap-1 cursor-pointer"
          >
            Xem tất cả <ArrowRight size={16} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

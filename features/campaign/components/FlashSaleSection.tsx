"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SaleCampaign } from "@/types/campaign";
import { FlashSaleTimer } from "./FlashSaleTimer";
import { Product } from "@/features/products/types";
import ProductCard from "@/features/home/components/ProductCard";
import ScrollReveal from "@/features/home/components/ScrollReveal";

interface FlashSaleSectionProps {
  campaign: SaleCampaign;
}

export function FlashSaleSection({ campaign }: FlashSaleSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (!campaign || !campaign.items || campaign.items.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    // Cuộn đúng 1 trang = toàn bộ chiều rộng container (4 card)
    container.scrollBy({
      left: direction === "left" ? -container.clientWidth : container.clientWidth,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 8);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 8
    );
  };

  // Map campaign items -> Product shape để dùng lại ProductCard
  const saleProducts: Product[] = campaign.items
    .filter((item) => !!item.product)
    .map((item) => ({
      ...(item.product as any),
      // Hiển thị giá sale là price, gốc là comparePrice
      price: item.salePrice,
      comparePrice: (item.product as any).price,
    }));

  return (
    <section className="mb-16">
      <ScrollReveal variant="slide-up" delay={0}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <h3 className="typo-heading-lg flex items-center gap-2">
              <span className="text-red-500">🔥</span>
              {campaign.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Kết thúc trong</span>
              <FlashSaleTimer endDate={campaign.endDate} />
            </div>
          </div>
          <Link
            href="/sale"
            className="text-[#13ec5b] typo-button-sm hover:underline flex items-center gap-1 shrink-0"
          >
            Xem tất cả <ArrowRight size={16} />
          </Link>
        </div>
      </ScrollReveal>

      {/* Slider wrapper */}
      <div className="relative group">
        {/* Left Button */}
        <button
          onClick={() => scroll("left")}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:bg-[#13ec5b] hover:border-[#13ec5b] hover:text-white transition-all duration-200
            ${canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"}
            sm:group-hover:opacity-100`}
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Right Button */}
        <button
          onClick={() => scroll("right")}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:bg-[#13ec5b] hover:border-[#13ec5b] hover:text-white transition-all duration-200
            ${canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"}
            sm:group-hover:opacity-100`}
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>

        {/* Products row — gap-6 = 24px khớp với grid gap-6 của ProductSection */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {saleProducts.map((product, idx) => (
            <div
              key={product.id}
              className="flex-none w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-18px)]"
            >
              <ScrollReveal variant="slide-up" delay={idx * 50}>
                <ProductCard product={product} />
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

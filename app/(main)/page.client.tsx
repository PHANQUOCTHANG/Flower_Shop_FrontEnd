"use client";

import { useEffect, useState } from "react";
import Hero from "@/features/home/components/Hero";
import Features from "@/features/home/components/Features";
import Categories from "@/features/home/components/Categories";
import ProductSection from "@/features/home/components/ProductSection";
import Consultation from "@/features/home/components/Consultation";
import LazySection from "@/features/home/components/LazySection";
import { FlashSaleSection } from "@/features/campaign/components/FlashSaleSection";
import { useHome, type HomeCategoryGroup } from "@/features/home/hooks/useHome";

export default function HomePageClient() {
  const { categories, categoriesLoading, productsByCategory, loading, activeCampaign } =
    useHome();

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1b0d11] transition-colors duration-300 font-sans antialiased overflow-x-hidden">
      <Hero />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20">
        <Features />

        {/* Section Flash Sale */}
        {activeCampaign && <FlashSaleSection campaign={activeCampaign as any} />}

        {/* Danh mục — load ngay vì near top */}
        <Categories categories={categories} loading={categoriesLoading} />

        {/* Sản phẩm theo từng danh mục — lazy load khi scroll tới */}
        {productsByCategory.map(({ category, products, loading }: HomeCategoryGroup, idx: number) => {
          if (!category) return null;
          return (
            <LazySection
              key={category.id}
              placeholderHeight="500px"
              rootMargin={idx === 0 ? "0px" : "150px"}
            >
              <ProductSection
                title={category.name}
                products={products}
                loading={loading}
                categorySlug={category.slug}
              />
            </LazySection>
          );
        })}

        <Consultation />
      </div>
    </div>
  );
}

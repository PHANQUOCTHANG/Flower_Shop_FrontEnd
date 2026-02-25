"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  Gallery,
  ProductInfo,
  ActionButtons,
  TrustBadges,
  DescriptionTab,
  ReviewsTab,
  SimilarProducts,
} from "@/features/product-detail/components";
import { useProductDetail } from "@/features/product-detail/hooks/useProductDetail";

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description",
  );

  // hooks
  const { PRODUCT_DATA, REVIEWS, SIMILAR_PRODUCTS } = useProductDetail();

  const handleQuantityChange = (type: "inc" | "dec") => {
    if (type === "inc") setQuantity((prev) => prev + 1);
    if (type === "dec" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-[#f6f8f6] dark:bg-[#102216] text-[#0d1b12] dark:text-white transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 typo-body-sm font-medium">
          <a href="#" className="text-[#13ec5b] hover:underline">
            Trang chủ
          </a>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <a href="#" className="text-[#13ec5b] hover:underline">
            Bó hoa tươi
          </a>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-500 truncate max-w-[150px] sm:max-w-none">
            {PRODUCT_DATA.name}
          </span>
        </nav>

        {/* Cấu trúc chi tiết sản phẩm */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mb-16">
          {/* Gallery */}
          <Gallery
            product={PRODUCT_DATA}
            activeImage={activeImage}
            onImageChange={setActiveImage}
          />

          {/* Thông tin sản phẩm và hành động */}
          <div className="flex flex-col">
            <ProductInfo product={PRODUCT_DATA} />

            <ActionButtons
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
            />

            <TrustBadges />
          </div>
        </div>

        {/* Khu vực Tabs: Mô tả và Đánh giá */}
        <section className="mb-16 border-t border-gray-100 dark:border-white/5 pt-10">
          <div className="flex gap-8 border-b border-gray-100 dark:border-white/10 mb-8">
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-4 typo-heading-sm transition-all relative ${
                activeTab === "description"
                  ? "text-[#13ec5b]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Mô tả chi tiết
              {activeTab === "description" && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#13ec5b] rounded-full"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-4 typo-heading-sm transition-all relative ${
                activeTab === "reviews"
                  ? "text-[#13ec5b]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Đánh giá ({REVIEWS.length})
              {activeTab === "reviews" && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#13ec5b] rounded-full"></span>
              )}
            </button>
          </div>

          <div className="min-h-[200px]">
            {activeTab === "description" ? (
              <DescriptionTab product={PRODUCT_DATA} />
            ) : (
              <ReviewsTab reviews={REVIEWS} />
            )}
          </div>
        </section>

        {/* Sản phẩm tương tự */}
        <SimilarProducts products={SIMILAR_PRODUCTS} />
      </main>
    </div>
  );
}

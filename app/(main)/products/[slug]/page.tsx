"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Gallery,
  ProductInfo,
  ActionButtons,
  TrustBadges,
  DescriptionTab,
  ReviewsTab,
  SimilarProducts,
} from "@/features/product-detail/components";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useProductDetail } from "@/features/product-detail/hooks/useProductDetail";
import { Loading } from "@/components/ui/Loading";

export default function ProductDetail() {
  const params = useParams();
  const slug = params.slug as string;

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description",
  );

  // hooks
  const { product, reviews, similarProducts, error, loading } =
    useProductDetail({
      slug,
    });

  const handleQuantityChange = (type: "inc" | "dec") => {
    if (type === "inc") setQuantity((prev) => prev + 1);
    if (type === "dec" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  if (loading) return <Loading></Loading>;

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f6f8f6] flex items-center justify-center">
        <p>Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#fcfbf9] text-[#1b0d11] transition-colors duration-300">
        <main className="max-w-360 mx-auto px-4 sm:px-10 lg:px-20 py-12">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Sản phẩm", href: "/products" },
              { label: product.name },
            ]}
          />

          {/* Cấu trúc chi tiết sản phẩm */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mb-16">
            {/* Gallery */}
            <Gallery
              product={product}
              activeImage={activeImage}
              onImageChange={setActiveImage}
            />

            {/* Thông tin sản phẩm và hành động */}
            <div className="flex flex-col">
              <ProductInfo product={product} />

              <ActionButtons
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
              />

              <TrustBadges />
            </div>
          </div>

          {/* Khu vực Tabs: Mô tả và Đánh giá */}
          <section className="mb-16 border-t border-gray-100 pt-10">
            <div className="flex gap-8 border-b border-gray-100 mb-8">
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
                Đánh giá ({reviews.length})
                {activeTab === "reviews" && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#13ec5b] rounded-full"></span>
                )}
              </button>
            </div>

            <div className="min-h-[200px]">
              {activeTab === "description" ? (
                <DescriptionTab product={product} />
              ) : (
                <ReviewsTab reviews={reviews} />
              )}
            </div>
          </section>

          {/* Sản phẩm tương tự */}
          <SimilarProducts products={similarProducts} />
        </main>
      </div>
    </>
  );
}

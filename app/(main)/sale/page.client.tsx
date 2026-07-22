"use client";

import React, { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { campaignService } from "@/features/campaign/services/campaignService";
import { FlashSaleTimer } from "@/features/campaign/components/FlashSaleTimer";
import ProductCard from "@/features/home/components/ProductCard";
import ScrollReveal from "@/features/home/components/ScrollReveal";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Pagination } from "@/components/ui/Pagination";
import { ProductListSkeleton } from "@/components/skeletons/ProductListSkeleton";
import { Product } from "@/features/products/types";
import { Flame } from "lucide-react";

const LIMIT = 8;

function SaleContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const { data, isLoading } = useQuery({
    queryKey: ["campaign", "active", "items", currentPage],
    queryFn: () => campaignService.getActiveCampaignItems(currentPage, LIMIT),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/sale?${params.toString()}`, { scroll: true });
  };

  if (isLoading) return <ProductListSkeleton />;

  const campaign = data?.campaign;
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  // Map items -> Product shape (price = salePrice, comparePrice = original price)
  const saleProducts: Product[] =
    (data?.data ?? [])
      .filter((item: any) => !!item.product)
      .map((item: any) => ({
        ...item.product,
        price: item.salePrice,
        comparePrice: item.product.price,
      }));

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1b0d11] font-sans antialiased">
      <main className="max-w-360 mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 lg:py-10">

        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6">
          <Breadcrumbs
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Flash Sale" },
            ]}
          />
        </div>

        {/* Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8 mb-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0d1b12] tracking-tight flex items-center gap-3">
              <Flame className="text-red-500 fill-red-500" size={40} />
              {campaign ? campaign.name : "Flash Sale"}
            </h1>
            {campaign && (
              <div className="flex items-center gap-2 text-sm text-gray-500 pb-1">
                <span>Kết thúc trong</span>
                <FlashSaleTimer endDate={campaign.endDate} />
              </div>
            )}
          </div>
          <p className="text-[#4c9a66] text-sm sm:text-base max-w-2xl">
            Săn ngay những ưu đãi hoa tươi cực hấp dẫn – số lượng có hạn, nhanh tay kẻo hết!
          </p>
        </div>

        {/* Không có campaign active */}
        {!campaign && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <span className="text-6xl">🌸</span>
            <h2 className="text-xl font-bold text-gray-700">Hiện chưa có chương trình khuyến mãi nào</h2>
            <p className="text-gray-400 text-sm max-w-sm">
              Quay lại sau để không bỏ lỡ những ưu đãi hấp dẫn nhất từ Flower_QT nhé!
            </p>
          </div>
        )}

        {/* Product grid */}
        {saleProducts.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-6">
              {meta?.total ?? 0} sản phẩm đang sale
              {totalPages > 1 && ` • Trang ${currentPage}/${totalPages}`}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {saleProducts.map((product, idx) => (
                <ScrollReveal key={product.id} variant="slide-up" delay={idx * 60}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default function SalePageClient() {
  return (
    <Suspense fallback={<ProductListSkeleton />}>
      <SaleContent />
    </Suspense>
  );
}

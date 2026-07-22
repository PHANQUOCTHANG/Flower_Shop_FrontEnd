"use client";

import React, { Suspense } from "react";
import { HeartOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Pagination } from "@/components/ui/Pagination";
import ProductCard from "@/features/home/components/ProductCard";
import ScrollReveal from "@/features/home/components/ScrollReveal";
import { wishlistService } from "@/features/wishlist/services/wishlistService";
import { ProductListSkeleton } from "@/components/skeletons/ProductListSkeleton";

const LIMIT = 8;

function WishlistContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const { data, isLoading } = useQuery({
    queryKey: ["wishlist", currentPage],
    queryFn: () => wishlistService.getWishlist(currentPage, LIMIT),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/favorite?${params.toString()}`, { scroll: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f6f6] px-4 sm:px-6 md:px-12 lg:px-40 py-10">
        <ProductListSkeleton />
      </div>
    );
  }

  const products = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f6] font-['Inter',_sans-serif] text-slate-900 transition-colors duration-300">
      <main className="flex-1 px-4 sm:px-6 md:px-12 lg:px-40 py-10 max-w-[1920px] mx-auto w-full">
        <Breadcrumbs
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Sản phẩm yêu thích" },
          ]}
        />

        <div className="mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-black text-slate-900 tracking-tighter uppercase mb-3 leading-tight">
            Sản phẩm <span className="text-[#EE2B5B]">yêu thích</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Lưu lại những bó hoa tuyệt đẹp để hoàn tất việc mua sắm sau này.
          </p>
        </div>

        {products.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Bạn có {meta?.total ?? 0} sản phẩm yêu thích
              {totalPages > 1 && ` • Trang ${currentPage}/${totalPages}`}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((item: any, idx: number) => (
                <ScrollReveal key={item.id} variant="slide-up" delay={idx * 60}>
                  <ProductCard product={item} />
                </ScrollReveal>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-in zoom-in-95 duration-700">
            <div className="size-48 mb-8 bg-[#EE2B5B]/5 rounded-full flex items-center justify-center text-[#EE2B5B]/30">
              <HeartOff size={84} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase mb-3">
              Danh sách đang trống
            </h2>
            <p className="text-slate-500 mb-10 max-w-sm font-medium">
              Bạn chưa có sản phẩm nào trong danh sách yêu thích. Hãy chọn cho mình những bó hoa ưng ý nhất nhé.
            </p>
            <button
              onClick={() => router.push("/products")}
              className="bg-[#EE2B5B] text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-[#EE2B5B]/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm"
            >
              Khám phá cửa hàng
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function WishlistPageClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8f6f6] px-4 sm:px-6 md:px-12 lg:px-40 py-10">
          <ProductListSkeleton />
        </div>
      }
    >
      <WishlistContent />
    </Suspense>
  );
}

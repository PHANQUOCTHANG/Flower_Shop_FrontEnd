import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#fcfbf9] font-sans antialiased">
      <main className="max-w-360 mx-auto px-4 sm:px-10 lg:px-20 py-10">
        <Breadcrumbs
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Sản phẩm", href: "/products" },
            { label: "Đang tải..." },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mt-8 mb-20">
          {/* Cột trái: Gallery */}
          <div className="flex flex-col gap-4">
            <Skeleton className="aspect-square w-full rounded-3xl" />
            <div className="flex gap-4 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-24 h-24 rounded-xl flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Cột phải: Info */}
          <div className="flex flex-col mt-4 lg:mt-0">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-8 w-1/3 mb-6" />
            
            <div className="space-y-2 mb-8">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>

            <Skeleton className="h-12 w-full rounded-full mb-4" />
            <Skeleton className="h-12 w-full rounded-full bg-gray-300 mb-8" />

            <div className="flex gap-4 mt-8">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

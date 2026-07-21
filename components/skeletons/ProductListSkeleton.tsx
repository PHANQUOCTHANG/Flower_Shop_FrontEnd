import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export function ProductListSkeleton() {
  return (
    <div className="min-h-screen bg-[#fcfbf9] font-sans antialiased">
      <main className="max-w-360 mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 lg:py-10">
        <div className="mb-4 sm:mb-6">
          <Breadcrumbs
            items={[{ label: "Trang chủ", href: "/" }, { label: "Sản phẩm" }]}
          />
        </div>

        <div className="mb-8 sm:mb-10 lg:mb-12">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-full max-w-lg mt-2" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {/* Sidebar Skeleton */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
            <Skeleton className="h-8 w-40 mt-8 mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Product Grid Skeleton */}
          <div className="flex-1">
            {/* Toolbar Skeleton */}
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-10 w-64" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col group">
                  <Skeleton className="aspect-[4/5] w-full rounded-2xl mb-4" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

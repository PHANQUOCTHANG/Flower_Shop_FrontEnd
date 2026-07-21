import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export function CartSkeleton() {
  return (
    <div className="min-h-screen font-sans antialiased bg-[#f4f1eb]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        <Breadcrumbs
          items={[{ label: "Trang chủ", href: "/" }, { label: "Giỏ hàng" }]}
        />

        <div className="flex justify-center my-8">
          <Skeleton className="h-10 w-full max-w-2xl rounded-full" />
        </div>

        <div className="flex flex-col gap-6 sm:gap-8 md:gap-8">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-8 lg:gap-8 items-start">
            
            {/* Cột trái: Danh sách sản phẩm */}
            <div className="flex-1 w-full space-y-6">
              <Skeleton className="h-8 w-48 mb-6" />

              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm">
                    <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-3 py-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex justify-between items-center mt-4">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-10 w-32 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Skeleton className="h-32 w-full rounded-2xl mt-8" />
            </div>

            {/* Cột phải: Summary Sidebar */}
            <div className="w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 sticky top-24">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
                <Skeleton className="h-8 w-40 mb-6" />
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 mb-8">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>

                <Skeleton className="h-14 w-full rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

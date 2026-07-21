"use client";

import { notFound } from "next/navigation";
import Alert from "@/components/ui/Alert";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductDetailSkeleton } from "@/components/skeletons/ProductDetailSkeleton";
import {
  Gallery,
  ProductInfo,
  ActionButtons,
  TrustBadges,
  SimilarProducts,
  TabNavigation,
  TabContent,
} from "@/features/product-detail/components";
import { useProductDetailLogic } from "@/features/product-detail/hooks/useProductDetailLogic";

const ALERT_POSITION = "fixed top-24 right-6 z-50 max-w-md";

export default function ProductDetailClient() {

  // quản lý toàn bộ logic của trang product detail trong 1 hook riêng biệt
  const { state, actions } = useProductDetailLogic();

  // --- Trạng thái tải và lỗi ---
  if (state.loading) return <ProductDetailSkeleton />;
  if (state.error || !state.product) notFound();

  // --- Render giao diện ---
  return (
    <>
      {/* Thông báo (Alert) */}
      {state.alert && (
        <div className={ALERT_POSITION}>
          <Alert
            type={state.alert.type}
            message={state.alert.message}
            onClose={() => actions.setAlert(null)}
            autoClose
            duration={4000}
          />
        </div>
      )}

      <div className="min-h-screen bg-[#fcfbf9] text-[#1b0d11] transition-colors duration-300">
        <main className="max-w-360 mx-auto px-4 sm:px-10 lg:px-20 py-10">

          {/* Điều hướng (Breadcrumb) */}
          <Breadcrumbs
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Sản phẩm", href: "/products" },
              { label: state.product.name },
            ]}
          />

          {/* Khối chính: Hình ảnh + Thông tin sản phẩm */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mt-8 mb-20">

            {/* Cột trái: Thư viện ảnh (sticky khi scroll trên desktop) */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Gallery
                product={state.product}
                activeImage={state.activeImage}
                onImageChange={actions.setActiveImage}
              />
            </div>

            {/* Cột phải: Thông tin & Hành động */}
            <div className="flex flex-col">
              {/* Tên sản phẩm, giá, mô tả ngắn */}
              <ProductInfo product={state.product} />

              {/* Chọn số lượng và nút thêm giỏ / đặt ngay */}
              <ActionButtons
                quantity={state.quantity}
                onQuantityChange={actions.handleQuantityChange}
                onAddToCart={actions.handleAddToCart}
                isLoading={state.isAdding}
              />

              {/* Huy hiệu cam kết chất lượng */}
              <TrustBadges />
            </div>
          </div>

          {/* Tabs: Mô tả chi tiết & Đánh giá */}
          <section className="mb-20 border-t border-gray-100 pt-12">
            <TabNavigation
              activeTab={state.activeTab}
              setActiveTab={actions.setActiveTab}
              slug={state.slug}
            />
            <TabContent
              activeTab={state.activeTab}
              product={state.product as any}
              slug={state.slug}
            />
          </section>

          {/* Sản phẩm tương tự (chỉ hiển thị khi có dữ liệu) */}
          {state.similarProducts && state.similarProducts.length > 0 && (
            <SimilarProducts
              category={state.product.categories?.[0]?.slug ?? ""}
              products={state.similarProducts}
            />
          )}
        </main>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import {
  Gallery,
  ProductInfo,
  ActionButtons,
  TrustBadges,
  SimilarProducts,
  TabNavigation,
  TabContent,
} from "@/features/product-detail/components";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Loading } from "@/components/ui/Loading";
import Alert from "@/components/ui/Alert";
import { useProductDetail } from "@/features/product-detail/hooks/useProductDetail";
import { useAuthStore } from "@/stores/auth.store";

type TabType = "description" | "reviews";

const ALERT_POSITION = "fixed top-24 right-6 z-50 max-w-md";

export default function ProductDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const isLogin = useAuthStore((state) => state.isAuthenticated);

  const {
    product,
    similarProducts,
    error,
    loading,
    addToCart,
    isAddingToCart,
  } = useProductDetail({ slug });

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
  };

  const handleQuantityChange = (type: "inc" | "dec") => {
    setQuantity((prev) => {
      if (type === "inc") return prev + 1;
      if (type === "dec" && prev > 1) return prev - 1;
      return prev;
    });
  };

  const handleAddToCart = async (qty: number) => {
    if (!isLogin) {
      showAlert("error", "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }
    try {
      await addToCart(qty);
      showAlert("success", "Thêm vào giỏ hàng thành công!");
      setQuantity(1);
    } catch {
      showAlert("error", "Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  if (loading) return <Loading />;
  if (error || !product) notFound();

  return (
    <>
      {/* Alert thông báo */}
      {alert && (
        <div className={ALERT_POSITION}>
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
            autoClose
            duration={4000}
          />
        </div>
      )}

      <div className="min-h-screen bg-[#fcfbf9] text-[#1b0d11] transition-colors duration-300">
        <main className="max-w-360 mx-auto px-4 sm:px-10 lg:px-20 py-12">
          {/* Breadcrumb */}
          <Breadcrumbs
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Sản phẩm", href: "/products" },
              { label: product.name },
            ]}
          />

          {/* Hình ảnh + Thông tin */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mb-16">
            <Gallery
              product={product}
              activeImage={activeImage}
              onImageChange={setActiveImage}
            />
            <div className="flex flex-col">
              <ProductInfo product={product} />
              <ActionButtons
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
                onAddToCart={handleAddToCart}
                isLoading={isAddingToCart}
              />
              <TrustBadges />
            </div>
          </div>

          {/* Tabs: Mô tả & Đánh giá */}
          <section className="mb-16 border-t border-gray-100 pt-10">
            <TabNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              slug={slug}
            />
            <TabContent activeTab={activeTab} product={product} slug={slug} />
          </section>

          {/* Sản phẩm tương tự */}
          {similarProducts && similarProducts.length > 0 && (
            <SimilarProducts
              category={product.categories[0]?.slug}
              products={similarProducts}
            />
          )}
        </main>
      </div>
    </>
  );
}

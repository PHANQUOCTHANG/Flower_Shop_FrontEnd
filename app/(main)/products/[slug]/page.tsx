"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";

// Import components
import {
  Gallery,
  ProductInfo,
  ActionButtons,
  TrustBadges,
  DescriptionTab,
  ReviewsTab,
  SimilarProducts,
  TabNavigation,
  TabContent,
} from "@/features/product-detail/components";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Loading } from "@/components/ui/Loading";
import Alert from "@/components/ui/Alert";

// Import hooks & stores
import { useProductDetail } from "@/features/product-detail/hooks/useProductDetail";
import { useAuthStore } from "@/stores/auth.store";

// Types
type TabType = "description" | "reviews";

// Constants - Giá trị mặc định cho state
const DEFAULTS = {
  QUANTITY: 1,
  TAB: "description" as const,
  IMAGE_INDEX: 0,
} as const;

// Cấu hình alert
const ALERT_CONFIG = {
  DURATION_MS: 4000,
  POSITION_CLASSES: "fixed top-24 right-6 z-50 max-w-md",
} as const;

// Thông báo cho người dùng
const USER_MESSAGES = {
  LOGIN_REQUIRED: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
  ADD_TO_CART_SUCCESS: "Thêm vào giỏ hàng thành công!",
  ADD_TO_CART_ERROR: "Có lỗi xảy ra khi thêm vào giỏ hàng",
} as const;

// Màu sử dụng trong ứng dụng
const COLOR_TOKENS = {
  PRIMARY: "#13ec5b",
  BACKGROUND: "#fcfbf9",
  TEXT: "#1b0d11",
} as const;

// Main component
export default function ProductDetail() {
  // ---- Lấy tham số từ URL ----
  const params = useParams();
  const slug = params.slug as string;

  // ---- Trạng thái xác thực ----
  const isLogin = useAuthStore((state) => state.isAuthenticated);

  // ---- Dữ liệu sản phẩm từ hook tùy chỉnh ----
  const {
    product,
    reviews,
    similarProducts,
    error,
    loading,
    addToCart,
    isAddingToCart,
  } = useProductDetail({ slug });

  // ---- Trạng thái xem sản phẩm ----
  const [activeImage, setActiveImage] = useState(DEFAULTS.IMAGE_INDEX);
  const [quantity, setQuantity] = useState(DEFAULTS.QUANTITY);
  const [activeTab, setActiveTab] = useState<TabType>(DEFAULTS.TAB as TabType);

  // ---- Trạng thái thông báo ----
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");

  // Handler functions - Xử lý thay đổi số lượng sản phẩm
  const handleQuantityChange = (type: "inc" | "dec") => {
    setQuantity((prev) => {
      if (type === "inc") return prev + 1;
      if (type === "dec" && prev > 1) return prev - 1;
      return prev;
    });
  };

  // Hiển thị thông báo cho người dùng
  const showNotification = (type: "success" | "error", message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
  };

  // Xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async (qty: number) => {
    // Kiểm tra đã đăng nhập chưa
    if (!isLogin) {
      showNotification("error", USER_MESSAGES.LOGIN_REQUIRED);
      return;
    }

    try {
      await addToCart(qty);
      showNotification("success", USER_MESSAGES.ADD_TO_CART_SUCCESS);
      setQuantity(DEFAULTS.QUANTITY);
    } catch {
      showNotification("error", USER_MESSAGES.ADD_TO_CART_ERROR);
    }
  };

  // Loading & error states
  if (loading) return <Loading />;
  if (error || !product) notFound();

  // Render
  return (
    <>
      {/* Overlay thông báo alert */}
      {showAlert && (
        <div className={ALERT_CONFIG.POSITION_CLASSES}>
          <Alert
            type={alertType}
            message={alertMessage}
            onClose={() => setShowAlert(false)}
            autoClose={true}
            duration={ALERT_CONFIG.DURATION_MS}
          />
        </div>
      )}

      <div
        className="min-h-screen transition-colors duration-300"
        style={{
          backgroundColor: COLOR_TOKENS.BACKGROUND,
          color: COLOR_TOKENS.TEXT,
        }}
      >
        <main className="max-w-360 mx-auto px-4 sm:px-10 lg:px-20 py-12">
          {/* Breadcrumb điều hướng */}
          <Breadcrumbs
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Sản phẩm", href: "/products" },
              { label: product.name },
            ]}
          />

          {/* Phần hiển thị: Hình ảnh + Thông tin sản phẩm */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mb-16">
            {/* Thư viện hình ảnh sản phẩm */}
            <Gallery
              product={product}
              activeImage={activeImage}
              onImageChange={setActiveImage}
            />

            {/* Thông tin và nút tương tác sản phẩm */}
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
              reviewsCount={reviews.length}
            />
            <TabContent
              activeTab={activeTab}
              product={product}
              reviews={reviews}
            />
          </section>

          {/* Sản phẩm tương tự trong cùng category */}
          <SimilarProducts
            category={product.categories[0]?.slug}
            products={similarProducts}
          />
        </main>
      </div>
    </>
  );
}

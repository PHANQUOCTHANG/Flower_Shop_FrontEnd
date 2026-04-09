/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Product } from "@/features/products/types";
import { Bolt, Heart, ShoppingCart, Check, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAddToCart } from "@/features/cart/hooks/useCart";
import { useAuthStore } from "@/stores/auth.store";

// Hằng số
const INITIAL_QUANTITY = 1;
const MAX_DEFAULT_QUANTITY = 99;
const SHOW_ADDED_TIMEOUT = 2000; // 2 giây hiển thị "Đã thêm"
const DROPDOWN_SIZE_COMPACT = 8;
const DROPDOWN_SIZE_DEFAULT = 10;

// Kiểu dữ liệu giỏ hàng
type CartState = "idle" | "picking" | "added";

// Props của component
interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

// Thẻ sản phẩm (Lưới / Danh sách)
export const ProductCard = ({
  product,
  viewMode = "grid",
}: ProductCardProps) => {
  const router = useRouter();
  const { mutateAsync: addToCart, isPending } = useAddToCart();
  const isLogin = useAuthStore((state) => state.isAuthenticated);

  // State
  const [cartState, setCartState] = useState<CartState>("idle");
  const [quantity, setQuantity] = useState(INITIAL_QUANTITY);

  // Tính toán thông tin kinh tế sản phẩm
  const discount = product.comparePrice
    ? Math.round(
        ((parseFloat(String(product.comparePrice)) -
          parseFloat(String(product.price))) /
          parseFloat(String(product.comparePrice))) *
          100,
      )
    : 0;

  // Tính toán trạng thái kho hàng
  const isLowStock =
    product.stockQuantity > 0 &&
    product.lowStockThreshold &&
    product.stockQuantity <= product.lowStockThreshold;
  const isOutOfStock = product.stockQuantity === 0;
  const maxQuantity = product.stockQuantity || MAX_DEFAULT_QUANTITY;

  // Xử lý sự kiện giỏ hàng

  // Bước 1: Mở bộ chọn số lượng
  const handleOpenPicker = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    if (!isLogin) {
      router.push("/login");
      return;
    }
    // Không mở picker nếu hết hàng
    if (isOutOfStock) return;
    setQuantity(INITIAL_QUANTITY);
    setCartState("picking");
  };

  // Bước 2: Xác nhận thêm vào giỏ
  const handleConfirmAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Gọi API thêm vào giỏ
      await addToCart({ productId: product.id, quantity });
      // Hiển thị trạng thái "đã thêm"
      setCartState("added");
      // Quay lại trạng thái ban đầu sau khoảng thời gian
      setTimeout(() => {
        setCartState("idle");
        setQuantity(INITIAL_QUANTITY);
      }, SHOW_ADDED_TIMEOUT);
    } catch {
      // Reset trạng thái nếu lỗi
      setCartState("idle");
    }
  };

  // Huỷ bỏ chọn số lượng
  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCartState("idle");
    setQuantity(INITIAL_QUANTITY);
  };

  // Thay đổi số lượng
  const changeQuantity = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    setQuantity((q) =>
      Math.min(maxQuantity, Math.max(INITIAL_QUANTITY, q + delta)),
    );
  };

  // Bộ chọn số lượng
  const QuantityPicker = ({ compact = false }: { compact?: boolean }) => (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`flex items-center gap-2 ${compact ? "" : "w-full"}`}
    >
      {/* Nút giảm */}
      <button
        onClick={(e) => changeQuantity(e, -1)}
        disabled={quantity <= INITIAL_QUANTITY}
        className="size-8 rounded-xl bg-gray-100 flex items-center justify-center text-[#0d1b12] hover:bg-[#13ec5b]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Minus size={DROPDOWN_SIZE_COMPACT} />
      </button>

      {/* Hiển thị số lượng */}
      <span className="w-8 text-center typo-button-sm text-[#0d1b12] font-bold select-none">
        {quantity}
      </span>

      {/* Nút tăng */}
      <button
        onClick={(e) => changeQuantity(e, 1)}
        disabled={quantity >= maxQuantity}
        className="size-8 rounded-xl bg-gray-100 flex items-center justify-center text-[#0d1b12] hover:bg-[#13ec5b]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Plus size={DROPDOWN_SIZE_COMPACT} />
      </button>

      {/* Nút xác nhận */}
      <button
        onClick={handleConfirmAdd}
        disabled={isPending}
        className="flex-1 h-8 px-3 rounded-xl bg-[#13ec5b] hover:bg-[#0ecf50] disabled:opacity-50 text-[#0d1b12] typo-button-sm font-bold transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
      >
        {isPending ? (
          <span className="animate-spin text-sm">⏳</span>
        ) : (
          <Check size={DROPDOWN_SIZE_COMPACT} />
        )}
        Thêm
      </button>

      {/* Nút huỷ */}
      <button
        onClick={handleCancel}
        className="size-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-300 transition-colors"
      >
        ✕
      </button>
    </div>
  );

  // Nút thêm vào giỏ
  const CartButton = ({ fullWidth = false }: { fullWidth?: boolean }) => {
    // Trạng thái: Đã thêm thành công
    if (cartState === "added") {
      return (
        <div
          className={`${fullWidth ? "w-full" : ""} py-3 rounded-2xl bg-[#13ec5b]/10 border-2 border-[#13ec5b] text-[#0d9e3e] typo-button-sm flex items-center justify-center gap-2`}
        >
          <Check size={16} />
          Đã thêm {quantity} vào giỏ!
        </div>
      );
    }

    // Trạng thái: Bình thường
    return (
      <button
        disabled={isOutOfStock}
        onClick={handleOpenPicker}
        className={`${fullWidth ? "w-full" : ""} p-3.5 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 border-2 border-[#13ec5b]/40 bg-white text-[#0d1b12] hover:border-[#13ec5b] hover:bg-[#13ec5b]/10 typo-button-sm disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <ShoppingCart size={16} />
        Thêm vào giỏ hàng
      </button>
    );
  };

  // Chế độ Danh sách (List View)
  if (viewMode === "list") {
    return (
      <div
        onClick={() => router.push(`/products/${product.slug}`)}
        className="flex gap-6 bg-white rounded-4xl overflow-hidden border border-transparent hover:border-[#13ec5b]/20 hover:shadow-2xl transition-all duration-500 p-6 cursor-pointer"
      >
        {/* Hình ảnh sản phẩm */}
        <div className="relative w-32 h-40 shrink-0 overflow-hidden rounded-2xl">
          {/* Badge: % giảm giá */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 z-10 text-white typo-caption-xs px-3 py-1.5 rounded-full shadow-lg bg-[#e91e63]">
              -{discount}%
            </div>
          )}

          {/* Badge: Hết hàng */}
          {isOutOfStock && (
            <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center">
              <span className="typo-button-sm text-white">Hết hàng</span>
            </div>
          )}

          {/* Badge: Sắp hết */}
          {isLowStock && (
            <div className="absolute top-3 right-3 z-10 text-white typo-caption-xs px-3 py-1.5 rounded-full shadow-lg bg-[#ff9800]">
              Sắp hết
            </div>
          )}

          {/* Nút yêu thích */}
          <button
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 z-10 size-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-[#e91e63] transition-all active:scale-90"
          >
            <Heart size={16} />
          </button>

          {/* Ảnh */}
          <img
            src={product.thumbnailUrl || undefined}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="typo-body text-[#0d1b12] mb-2 hover:text-[#13ec5b] transition-colors line-clamp-2">
              {product.name}
            </h3>
            {product.sku && (
              <p className="typo-caption-xs text-[#4c9a66] mb-2 font-mono">
                SKU: {product.sku}
              </p>
            )}
            {product.shortDescription && (
              <p className="typo-caption-sm text-[#4c9a66] mb-3 line-clamp-2">
                {product.shortDescription}
              </p>
            )}
            <div className="flex items-center gap-3">
              <p className="typo-heading-md text-[#e91e63]">
                {parseInt(String(product.price)).toLocaleString("vi-VN")}đ
              </p>
              {product.comparePrice && (
                <p className="typo-caption-sm text-[#ccc] line-through">
                  {parseInt(String(product.comparePrice)).toLocaleString(
                    "vi-VN",
                  )}
                  đ
                </p>
              )}
            </div>
          </div>

          {/* Khu vực hành động */}
          <div className="flex flex-wrap gap-3 mt-3 items-center">
            {/* Nút MUA NGAY */}
            <button
              disabled={isOutOfStock}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/products/${product.slug}`);
              }}
              className="bg-[#e91e63] hover:bg-[#db2777] disabled:bg-gray-400 disabled:cursor-not-allowed text-white typo-button-sm py-3 px-5 rounded-2xl transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Bolt size={16} fill="currentColor" />
              {isOutOfStock ? "HẾT HÀNG" : "MUA NGAY"}
            </button>

            {/* Giỏ hàng: Bộ chọn hoặc Nút thêm */}
            {cartState === "picking" ? (
              <QuantityPicker compact />
            ) : (
              <CartButton />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Chế độ Lưới (Grid View) - Mặc định
  return (
    <div
      onClick={() => router.push(`/products/${product.slug}`)}
      className="group flex flex-col bg-white rounded-4xl overflow-hidden border border-transparent hover:border-[#13ec5b]/20 hover:shadow-2xl transition-all duration-500 cursor-pointer"
    >
      {/* Phần hình ảnh */}
      <div className="relative aspect-4/5 overflow-hidden">
        {/* Badge: % giảm giá */}
        {discount > 0 && (
          <div className="absolute top-5 left-5 z-10 text-white typo-caption-xs px-3 py-1.5 rounded-full shadow-lg bg-[#e91e63]">
            -{discount}%
          </div>
        )}

        {/* Badge: Hết hàng */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center">
            <span className="typo-button-sm text-white">Hết hàng</span>
          </div>
        )}

        {/* Badge: Sắp hết */}
        {isLowStock && (
          <div className="absolute top-5 right-5 z-10 text-white typo-caption-xs px-3 py-1.5 rounded-full shadow-lg bg-[#ff9800]">
            Sắp hết
          </div>
        )}

        {/* Nút yêu thích */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-5 right-5 z-10 size-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-[#e91e63] transition-all active:scale-90"
        >
          <Heart size={DROPDOWN_SIZE_DEFAULT} />
        </button>

        {/* Ảnh */}
        <img
          src={product.thumbnailUrl || undefined}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
      </div>

      {/* Phần thông tin */}
      <div className="p-6 flex flex-col flex-1">
        {/* Tiêu đề & giá */}
        <div className="flex flex-col gap-2 mb-6">
          <h3 className="typo-body text-[#0d1b12] group-hover:text-[#13ec5b] transition-colors line-clamp-2">
            {product.name}
          </h3>
          {product.sku && (
            <p className="typo-caption-xs text-[#4c9a66] font-mono">
              SKU: {product.sku}
            </p>
          )}
          {product.shortDescription && (
            <p className="typo-caption-sm text-[#4c9a66] line-clamp-2">
              {product.shortDescription}
            </p>
          )}
          <div className="flex items-center gap-2 pt-2">
            <p className="typo-heading-md text-[#e91e63]">
              {parseInt(String(product.price)).toLocaleString("vi-VN")}đ
            </p>
            {product.comparePrice && (
              <p className="typo-caption-sm text-[#ccc] line-through">
                {parseInt(String(product.comparePrice)).toLocaleString("vi-VN")}
                đ
              </p>
            )}
          </div>
        </div>

        {/* Khu vực hành động */}
        <div className="mt-auto flex flex-col gap-3">
          {/* Nút MUA NGAY */}
          <button
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/products/${product.slug}`);
            }}
            className="w-full bg-[#e91e63] hover:bg-[#db2777] disabled:bg-gray-400 disabled:cursor-not-allowed text-white typo-button-sm py-4 rounded-2xl transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Bolt size={18} fill="currentColor" />
            {isOutOfStock ? "HẾT HÀNG" : "MUA NGAY"}
          </button>

          {/* Giỏ hàng: Bộ chọn hoặc Nút thêm */}
          {cartState === "picking" ? (
            <div onClick={(e) => e.stopPropagation()} className="w-full">
              <QuantityPicker />
            </div>
          ) : (
            <CartButton fullWidth />
          )}
        </div>
      </div>
    </div>
  );
};

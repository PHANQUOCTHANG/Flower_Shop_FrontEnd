"use client";

import { useState } from "react";
import { Product } from "@/features/products/types";
import { Bolt, Heart, ShoppingCart, Check, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAddToCart } from "@/features/cart/hooks/useCart";
import { useAuthStore } from "@/stores/auth.store";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

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

interface QuantityPickerProps {
  compact?: boolean;
  quantity: number;
  maxQuantity: number;
  isPending: boolean;
  onChangeQuantity: (e: React.MouseEvent, delta: number) => void;
  onConfirmAdd: (e: React.MouseEvent) => void;
  onCancel: (e: React.MouseEvent) => void;
}

const QuantityPicker = ({ compact = false, quantity, maxQuantity, isPending, onChangeQuantity, onConfirmAdd, onCancel }: QuantityPickerProps) => (
  <div
    onClick={(e) => e.stopPropagation()}
    className={`flex items-center gap-2 ${compact ? "" : "w-full"}`}
  >
    <button
      onClick={(e) => onChangeQuantity(e, -1)}
      disabled={quantity <= INITIAL_QUANTITY}
      className="size-8 rounded-xl bg-gray-100 flex items-center justify-center text-[#0d1b12] hover:bg-[#13ec5b]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <Minus size={DROPDOWN_SIZE_COMPACT} />
    </button>
    <span className="w-6 sm:w-8 text-center text-xs sm:text-sm text-[#0d1b12] font-bold select-none">
      {quantity}
    </span>
    <button
      onClick={(e) => onChangeQuantity(e, 1)}
      disabled={quantity >= maxQuantity}
      className="size-8 rounded-xl bg-gray-100 flex items-center justify-center text-[#0d1b12] hover:bg-[#13ec5b]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <Plus size={DROPDOWN_SIZE_COMPACT} />
    </button>
    <button
      onClick={onConfirmAdd}
      disabled={isPending}
      className="flex-1 h-8 px-2 sm:px-3 rounded-xl bg-[#13ec5b] hover:bg-[#0ecf50] disabled:opacity-50 text-[#0d1b12] text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
    >
      {isPending ? (
        <span className="animate-spin text-xs sm:text-sm">⏳</span>
      ) : (
        <Check size={DROPDOWN_SIZE_COMPACT} />
      )}
      Thêm
    </button>
    <button
      onClick={onCancel}
      className="size-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-300 transition-colors"
    >
      ✕
    </button>
  </div>
);

interface CartButtonProps {
  fullWidth?: boolean;
  isListView?: boolean;
  cartState: CartState;
  quantity: number;
  isOutOfStock: boolean;
  onOpenPicker: (e: React.MouseEvent) => void;
}

const CartButton = ({
  fullWidth = false,
  isListView = false,
  cartState,
  quantity,
  isOutOfStock,
  onOpenPicker
}: CartButtonProps) => {
  const paddingClass = isListView ? "py-2 sm:py-2.5" : "py-3.5";
  const roundedClass = isListView
    ? "rounded-lg sm:rounded-xl"
    : "rounded-[14px]";

  if (cartState === "added") {
    return (
      <div
        className={`${fullWidth ? "w-full" : ""} ${paddingClass} px-3 sm:px-4 ${roundedClass} bg-[#13ec5b]/10 border-2 border-[#13ec5b] text-[#0d9e3e] text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap`}
      >
        <Check size={16} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        Đã thêm {quantity} vào giỏ!
      </div>
    );
  }

  return (
    <button
      disabled={isOutOfStock}
      onClick={onOpenPicker}
      className={`${fullWidth ? "w-full" : ""} ${paddingClass} px-3 sm:px-4 ${roundedClass} transition-all active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2 border-2 border-[#13ec5b]/40 bg-white text-[#0d1b12] hover:border-[#13ec5b] hover:bg-[#13ec5b]/10 text-xs sm:text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap`}
    >
      <ShoppingCart size={16} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      Thêm vào giỏ
    </button>
  );
};

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



  // Chế độ Danh sách (List View)
  if (viewMode === "list") {
    return (
      <div
        onClick={() => router.push(`/products/${product.slug}`)}
        className="flex flex-row gap-3 sm:gap-6 bg-white rounded-2xl sm:rounded-4xl overflow-hidden border border-gray-100 hover:border-[#13ec5b]/30 hover:shadow-xl transition-all duration-300 p-3 sm:p-6 cursor-pointer"
      >
        {/* Hình ảnh sản phẩm */}
        <div className="relative w-28 h-32 sm:w-36 sm:h-44 md:w-48 md:h-56 shrink-0 overflow-hidden rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100/50">
          {/* Badge: % giảm giá */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 z-10 text-white typo-caption-xs px-3 py-1.5 rounded-full shadow-lg bg-[#ef4444]">
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
            className="absolute top-3 right-3 z-10 size-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-[#13ec5b] transition-all active:scale-90"
          >
            <Heart size={16} />
          </button>

          {/* Ảnh */}
          <OptimizedImage
            src={product.thumbnailUrl}
            alt={product.name}
            fill
            objectFit="contain"
            className="transition-transform duration-700 hover:scale-105 p-2"
            sizes="144px"
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#0d1b12] mb-1 sm:mb-2 hover:text-[#13ec5b] transition-colors line-clamp-2">
              {product.name}
            </h3>
            {product.sku && (
              <p className="text-[10px] sm:text-xs text-gray-500 mb-2 font-mono bg-gray-100/50 w-fit px-1.5 py-0.5 rounded">
                SKU: {product.sku}
              </p>
            )}

            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-1">
              <p className="text-base sm:text-lg md:text-xl font-black text-black">
                {parseInt(String(product.price)).toLocaleString("vi-VN")}đ
              </p>
              {product.comparePrice && (
                <p className="text-[10px] sm:text-sm text-gray-400 line-through font-medium">
                  {parseInt(String(product.comparePrice)).toLocaleString(
                    "vi-VN",
                  )}
                  đ
                </p>
              )}
            </div>
          </div>

          {/* Khu vực hành động */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-3 items-center">
            {/* Nút MUA NGAY */}
            <button
              disabled={isOutOfStock}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/products/${product.slug}`);
              }}
              className="bg-[#EE2B5B] hover:bg-[#B3163B] disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold py-2 sm:py-2.5 px-3 sm:px-5 rounded-lg sm:rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-1.5 flex-1 sm:flex-none shadow-sm hover:shadow-md"
            >
              <Bolt size={14} className="sm:w-4 sm:h-4" fill="currentColor" />
              <span className="whitespace-nowrap">
                {isOutOfStock ? "HẾT HÀNG" : "MUA NGAY"}
              </span>
            </button>

            {/* Giỏ hàng: Bộ chọn hoặc Nút thêm */}
            {cartState === "picking" ? (
              <div className="w-full sm:w-auto mt-2 sm:mt-0">
                <QuantityPicker compact quantity={quantity} maxQuantity={maxQuantity} isPending={isPending} onChangeQuantity={changeQuantity} onConfirmAdd={handleConfirmAdd} onCancel={handleCancel} />
              </div>
            ) : (
              <div className="flex-none">
                <CartButton isListView cartState={cartState} quantity={quantity} isOutOfStock={isOutOfStock} onOpenPicker={handleOpenPicker} />
              </div>
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
      className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer"
    >
      {/* Phần hình ảnh – aspect-[4/5] = tỷ lệ 4:5 chuẩn cho card hoa */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        {/* Badge: % giảm giá */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 z-10 text-white typo-caption-xs px-3 py-1.5 rounded-full shadow-lg bg-[#ef4444]">
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
          <div className="absolute top-4 right-4 z-10 text-white typo-caption-xs px-3 py-1.5 rounded-full shadow-lg bg-[#ff9800]">
            Sắp hết
          </div>
        )}

        {/* Nút yêu thích */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-4 right-4 z-10 size-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-[#13ec5b] transition-all active:scale-90"
        >
          <Heart size={DROPDOWN_SIZE_DEFAULT} />
        </button>

        {/* Ảnh */}
        <OptimizedImage
          src={product.thumbnailUrl}
          alt={product.name}
          fill
          objectFit="contain"
          className="transition-transform duration-700 group-hover:scale-105 p-3"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      </div>

      {/* Phần thông tin */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Tiêu đề & giá */}
        <div className="flex flex-col gap-1.5 mb-4">
          <h3 className="text-sm font-bold text-gray-800 group-hover:text-[#13ec5b] transition-colors line-clamp-1">
            {product.name}
          </h3>
          {product.sku && (
            <p className="text-[10px] text-gray-400 font-mono">
              Mã sản phẩm: {product.sku}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <p className="text-base font-black text-[#1b0d11]">
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
            className="w-full bg-[#EE2B5B] hover:bg-[#B3163B] disabled:bg-gray-400 disabled:cursor-not-allowed text-white typo-button-sm py-3.5 rounded-[14px] transition-all transform active:scale-95 flex items-center justify-center gap-2 font-bold"
          >
            <Bolt size={16} fill="currentColor" />
            {isOutOfStock ? "HẾT HÀNG" : "MUA NGAY"}
          </button>

          {/* Giỏ hàng: Bộ chọn hoặc Nút thêm */}
          {cartState === "picking" ? (
            <div onClick={(e) => e.stopPropagation()} className="w-full">
              <QuantityPicker quantity={quantity} maxQuantity={maxQuantity} isPending={isPending} onChangeQuantity={changeQuantity} onConfirmAdd={handleConfirmAdd} onCancel={handleCancel} />
            </div>
          ) : (
            <CartButton fullWidth isListView={false} cartState={cartState} quantity={quantity} isOutOfStock={isOutOfStock} onOpenPicker={handleOpenPicker} />
          )}
        </div>
      </div>
    </div>
  );
};

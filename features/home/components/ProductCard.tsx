"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import { Product } from "@/features/products/types";
import { useAddToCart } from "@/features/cart/hooks/useCart";
import { useAuthStore } from "@/stores/auth.store";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import Alert from "@/components/ui/Alert";
import { createPortal } from "react-dom";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { mutateAsync: addToCart, isPending } = useAddToCart();
  const isLogin = useAuthStore((state) => state.isAuthenticated);

  const [cartState, setCartState] = useState<"idle" | "picking" | "added">(
    "idle",
  );
  const [quantity, setQuantity] = useState(1);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const isOutOfStock = product.stockQuantity === 0;
  const maxQty = product.stockQuantity || 99;

  const discount = product.comparePrice
    ? Math.round(
        ((parseFloat(String(product.comparePrice)) -
          parseFloat(String(product.price))) /
          parseFloat(String(product.comparePrice))) *
          100,
      )
    : 0;

  const handleOpenPicker = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLogin) {
      setAlert({ type: "error", message: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng" });
      return;
    }
    if (isOutOfStock) return;
    setQuantity(1);
    setCartState("picking");
  };

  const handleConfirmAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await addToCart({ productId: product.id, quantity });
      setCartState("added");
      setAlert({ type: "success", message: "Thêm vào giỏ hàng thành công!" });
      setTimeout(() => {
        setCartState("idle");
        setQuantity(1);
      }, 2000);
    } catch {
      setCartState("idle");
      setAlert({ type: "error", message: "Có lỗi xảy ra khi thêm vào giỏ hàng" });
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCartState("idle");
    setQuantity(1);
  };

  const changeQty = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    setQuantity((q) => Math.min(maxQty, Math.max(1, q + delta)));
  };

  return (
    <>
      {alert && typeof document !== "undefined" && createPortal(
        <div className="fixed top-24 right-6 z-[100] max-w-md">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
            autoClose
            duration={4000}
          />
        </div>,
        document.body
      )}
      <div
        onClick={() => router.push(`/products/${product.slug}`)}
        className="group bg-white rounded-2xl overflow-hidden border border-[#e7f3eb] hover:shadow-xl hover:border-[#13ec5b]/30 transition-all duration-300 cursor-pointer flex flex-col h-full"
      >
        {/* Ảnh */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          {discount > 0 && (
            <span className="absolute top-3 left-3 z-10 text-white text-[10px] font-bold px-2 py-1 rounded-md bg-[#13ec5b]">
              -{discount}%
            </span>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xs font-bold">Hết hàng</span>
            </div>
          )}
          <OptimizedImage
            src={
              product.thumbnailUrl ||
              "https://images.unsplash.com/photo-1561181286-d3efa7d11f63?q=80&w=400"
            }
            alt={product.name}
            fill
            objectFit="contain"
            className="transition-transform duration-500 group-hover:scale-105 p-3"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4 flex flex-col flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-1 mb-1 group-hover:text-[#13ec5b] transition-colors">
            {product.name}
          </h4>
          {product.sku && (
            <p className="text-[9px] sm:text-[10px] text-gray-400 font-mono mb-1 line-clamp-1">
              Mã sản phẩm: {product.sku}
            </p>
          )}
          <div className="flex items-center gap-1 sm:gap-2 mb-3 mt-1 flex-wrap">
            <span className="text-[#1b0d11] font-black text-sm sm:text-base">
              {parseInt(String(product.price)).toLocaleString("vi-VN")}đ
            </span>
            {product.comparePrice && (
              <span className="text-gray-400 text-[9px] sm:text-xs line-through">
                {parseInt(String(product.comparePrice)).toLocaleString("vi-VN")}đ
              </span>
            )}
          </div>

          {/* Nút hành động */}
          <div className="mt-auto flex flex-col gap-1.5 sm:gap-2">
            {/* Thêm vào giỏ / picker */}
            {cartState === "added" ? (
              <div className="w-full py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#13ec5b]/10 border border-[#13ec5b] text-[#0d9e3e] text-xs font-bold flex items-center justify-center gap-1 flex-shrink-0">
                <Check size={12} /> Đã thêm {quantity} vào giỏ!
              </div>
            ) : cartState === "picking" ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-0.5 sm:gap-1 min-w-0 w-full flex-shrink-0"
              >
                <button
                  onClick={(e) => changeQty(e, -1)}
                  disabled={quantity <= 1}
                  className="size-6 sm:size-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-[#13ec5b]/20 disabled:opacity-30 transition-colors flex-shrink-0"
                >
                  <Minus size={11} />
                </button>
                <span className="w-5 sm:w-6 text-center text-xs font-bold select-none flex-shrink-0">
                  {quantity}
                </span>
                <button
                  onClick={(e) => changeQty(e, 1)}
                  disabled={quantity >= maxQty}
                  className="size-6 sm:size-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-[#13ec5b]/20 disabled:opacity-30 transition-colors flex-shrink-0"
                >
                  <Plus size={11} />
                </button>
                <button
                  onClick={handleConfirmAdd}
                  disabled={isPending}
                  className="flex-1 min-w-0 h-6 sm:h-7 rounded-lg bg-[#13ec5b] hover:bg-[#0ecf50] disabled:opacity-50 text-[#0d1b12] text-xs font-bold flex items-center justify-center gap-1"
                >
                  {isPending ? (
                    <span className="animate-spin text-[10px]">⏳</span>
                  ) : (
                    <Check size={11} />
                  )}
                  Thêm
                </button>
                <button
                  onClick={handleCancel}
                  className="size-6 sm:size-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors text-xs flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                disabled={isOutOfStock}
                onClick={handleOpenPicker}
                className="w-full py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-2 border-[#13ec5b]/40 bg-white text-[#0d1b12] hover:border-[#13ec5b] hover:bg-[#13ec5b]/10 text-xs sm:text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-all active:scale-95 flex-shrink-0"
              >
                <ShoppingCart size={13} /> Thêm vào giỏ
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}



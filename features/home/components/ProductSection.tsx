/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShoppingCart, Check, Plus, Minus, Bolt } from "lucide-react";
import { Product } from "@/features/products/types";
import { useAddToCart } from "@/features/cart/hooks/useCart";
import { useAuthStore } from "@/stores/auth.store";
import ScrollReveal from "./ScrollReveal";
import Link from "next/link";

// ─── Mini ProductCard riêng cho home ────────────────────────────────────────
function HomeProductCard({ product }: { product: Product }) {
 const router = useRouter();
 const { mutateAsync: addToCart, isPending } = useAddToCart();
 const isLogin = useAuthStore((state) => state.isAuthenticated);

 const [cartState, setCartState] = useState<"idle" | "picking" | "added">("idle");
 const [quantity, setQuantity] = useState(1);

 const isOutOfStock = product.stockQuantity === 0;
 const maxQty = product.stockQuantity || 99;

 const discount = product.comparePrice
 ? Math.round(
 ((parseFloat(String(product.comparePrice)) - parseFloat(String(product.price))) /
 parseFloat(String(product.comparePrice))) * 100,
 )
 : 0;

 const handleOpenPicker = (e: React.MouseEvent) => {
 e.stopPropagation();
 if (!isLogin) { router.push("/login"); return; }
 if (isOutOfStock) return;
 setQuantity(1);
 setCartState("picking");
 };

 const handleConfirmAdd = async (e: React.MouseEvent) => {
 e.stopPropagation();
 try {
 await addToCart({ productId: product.id, quantity });
 setCartState("added");
 setTimeout(() => { setCartState("idle"); setQuantity(1); }, 2000);
 } catch { setCartState("idle"); }
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
 <div
 onClick={() => router.push(`/products/${product.slug}`)}
 className="group bg-white rounded-2xl overflow-hidden border border-[#e7f3eb] hover:shadow-xl hover:border-[#13ec5b]/30 transition-all duration-300 cursor-pointer flex flex-col"
 >
 {/* Ảnh */}
 <div className="relative aspect-[3/4] overflow-hidden">
 {discount > 0 && (
 <span className="absolute top-3 left-3 z-10 text-white text-[10px] font-bold px-2 py-1 rounded-md bg-[#e91e63]">
 -{discount}%
 </span>
 )}
 {isOutOfStock && (
 <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center">
 <span className="text-white text-xs font-bold">Hết hàng</span>
 </div>
 )}
 <img
 src={product.thumbnailUrl || "https://images.unsplash.com/photo-1561181286-d3efa7d11f63?q=80&w=400"}
 alt={product.name}
 className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
 loading="lazy"
 />
 </div>

 {/* Info */}
 <div className="p-4 flex flex-col flex-1">
 <h4 className="typo-body text-[#0d1b12] line-clamp-1 mb-1 group-hover:text-[#13ec5b] transition-colors">
 {product.name}
 </h4>
 <div className="flex items-center gap-2 mb-3">
 <span className="text-[#e91e63] typo-heading-sm">
 {parseInt(String(product.price)).toLocaleString("vi-VN")}đ
 </span>
 {product.comparePrice && (
 <span className="text-gray-400 typo-caption line-through">
 {parseInt(String(product.comparePrice)).toLocaleString("vi-VN")}đ
 </span>
 )}
 </div>

 {/* Nút hành động */}
 <div className="mt-auto flex flex-col gap-2">
 {/* MUA NGAY */}
 <button
 disabled={isOutOfStock}
 onClick={(e) => { e.stopPropagation(); router.push(`/products/${product.slug}`); }}
 className="w-full bg-[#e91e63] hover:bg-[#db2777] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-bold py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
 >
 <Bolt size={14} fill="currentColor" />
 {isOutOfStock ? "HẾT HÀNG" : "MUA NGAY"}
 </button>

 {/* Thêm vào giỏ / picker */}
 {cartState === "added" ? (
 <div className="w-full py-2 rounded-xl bg-[#13ec5b]/10 border border-[#13ec5b] text-[#0d9e3e] text-xs font-bold flex items-center justify-center gap-1">
 <Check size={13} /> Đã thêm {quantity} vào giỏ!
 </div>
 ) : cartState === "picking" ? (
 <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-1">
 <button onClick={(e) => changeQty(e, -1)} disabled={quantity <= 1}
 className="size-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-[#13ec5b]/20 disabled:opacity-30 transition-colors">
 <Minus size={12} />
 </button>
 <span className="w-7 text-center text-xs font-bold select-none">{quantity}</span>
 <button onClick={(e) => changeQty(e, 1)} disabled={quantity >= maxQty}
 className="size-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-[#13ec5b]/20 disabled:opacity-30 transition-colors">
 <Plus size={12} />
 </button>
 <button onClick={handleConfirmAdd} disabled={isPending}
 className="flex-1 h-7 rounded-lg bg-[#13ec5b] hover:bg-[#0ecf50] disabled:opacity-50 text-[#0d1b12] text-xs font-bold flex items-center justify-center gap-1">
 <Check size={12} /> Thêm
 </button>
 <button onClick={handleCancel}
 className="size-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors text-xs">
 ✕
 </button>
 </div>
 ) : (
 <button
 disabled={isOutOfStock}
 onClick={handleOpenPicker}
 className="w-full py-2 rounded-xl border-2 border-[#13ec5b]/40 bg-white text-[#0d1b12] hover:border-[#13ec5b] hover:bg-[#13ec5b]/10 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-all active:scale-95"
 >
 <ShoppingCart size={13} /> Thêm vào giỏ
 </button>
 )}
 </div>
 </div>
 </div>
 );
}

// ─── Skeleton loader ────────────────────────────────────────────────────────
function ProductCardSkeleton() {
 return (
 <div className="bg-white rounded-2xl overflow-hidden border border-[#e7f3eb] animate-pulse">
 <div className="aspect-[3/4] bg-gray-200 " />
 <div className="p-4 space-y-2">
 <div className="h-4 bg-gray-200 rounded w-3/4" />
 <div className="h-5 bg-gray-200 rounded w-1/2" />
 <div className="h-8 bg-gray-200 rounded-xl mt-3" />
 <div className="h-8 bg-gray-200 rounded-xl" />
 </div>
 </div>
 );
}

// ─── ProductSection ─────────────────────────────────────────────────────────
interface ProductSectionProps {
 title: string;
 products: Product[];
 loading?: boolean;
 categorySlug?: string;
}

export default function ProductSection({
 title,
 products,
 loading = false,
 categorySlug,
}: ProductSectionProps) {
 const viewAllHref = categorySlug ? `/products?category=${categorySlug}` : "/products";

 return (
 <section className="mb-16">
 <ScrollReveal variant="slide-up" delay={0}>
 <div className="flex items-center justify-between mb-8 px-2">
 <h3 className="typo-heading-lg">{title}</h3>
 <Link
 href={viewAllHref}
 className="text-[#13ec5b] typo-button-sm hover:underline flex items-center gap-1"
 >
 Xem tất cả <ArrowRight size={16} />
 </Link>
 </div>
 </ScrollReveal>

 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
 {loading
 ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
 : products.slice(0, 8).map((product, idx) => (
 <ScrollReveal key={product.id} variant="slide-up" delay={idx * 60}>
 <HomeProductCard product={product} />
 </ScrollReveal>
 ))}
 </div>
 </section>
 );
}



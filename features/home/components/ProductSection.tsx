"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ShoppingCart,
  Check,
  Plus,
  Minus,
  Bolt,
} from "lucide-react";
import { Product } from "@/features/products/types";
import { useAddToCart } from "@/features/cart/hooks/useCart";
import { useAuthStore } from "@/stores/auth.store";
import ScrollReveal from "./ScrollReveal";
import Link from "next/link";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import ProductCard from "./ProductCard";

// ─── Skeleton loader ────────────────────────────────────────────────────────
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
  const viewAllHref = categorySlug
    ? `/products?category=${categorySlug}`
    : "/products";

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
          ? Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : products.slice(0, 8).map((product, idx) => (
              <ScrollReveal
                key={product.id}
                variant="slide-up"
                delay={idx * 60}
              >
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
      </div>
    </section>
  );
}

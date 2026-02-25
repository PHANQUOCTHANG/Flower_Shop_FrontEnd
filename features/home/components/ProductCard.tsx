"use client";

import React from "react";
import { Heart } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  badgeType?: "discount" | "new" | "hot";
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-[#e7f3eb] dark:border-white/10 hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[3/4] overflow-hidden">
        {product.badge && (
          <div
            className={`absolute top-3 left-3 z-10 text-white text-[10px] font-bold px-2 py-1 rounded-md ${
              product.badgeType === "discount"
                ? "bg-[#e91e63]"
                : product.badgeType === "new"
                  ? "bg-[#13ec5b] text-[#0d1b12]"
                  : "bg-[#e91e63]"
            }`}
          >
            {product.badge}
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <button className="absolute bottom-3 right-3 z-10 size-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-[#e91e63] shadow-md hover:scale-110 transition-transform">
          <Heart size={20} fill="currentColor" />
        </button>
      </div>
      <div className="p-4 text-center">
        <h4 className="typo-body text-[#0d1b12] dark:text-white line-clamp-1 mb-1">
          {product.name}
        </h4>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-[#e91e63] typo-heading-sm">
            {product.price.toLocaleString("vi-VN")}đ
          </span>
          {product.oldPrice && (
            <span className="text-gray-400 typo-caption line-through">
              {product.oldPrice.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>
        <button className="w-full bg-[#e91e63] text-white py-3 rounded-xl typo-button-sm hover:brightness-110 active:scale-95 transition-all">
          MUA NGAY
        </button>
      </div>
    </div>
  );
}

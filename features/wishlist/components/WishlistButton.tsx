"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlist.store";
import { useToggleWishlist } from "@/features/wishlist/hooks/useWishlist";

interface WishlistButtonProps {
  productId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function WishlistButton({ productId, size = "md", className }: WishlistButtonProps) {
  const isFavorited = useWishlistStore((state) => state.isInWishlist(productId));
  const toggleMutation = useToggleWishlist();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn link bọc bên ngoài chạy
    e.stopPropagation();
    toggleMutation.mutate(productId);
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const buttonSizes = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5",
  };

  return (
    <button
      onClick={handleToggle}
      className={`rounded-full bg-white/90 backdrop-blur-md shadow-sm transition-all active:scale-90 z-10 ${buttonSizes[size]} ${isFavorited ? "text-[#EE2B5B] shadow-[#EE2B5B]/20" : "text-slate-400 hover:text-[#EE2B5B]"} ${className || ""}`}
      title={isFavorited ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
    >
      <Heart
        size={iconSizes[size]}
        className={`transition-transform duration-300 ${isFavorited ? "fill-current scale-110" : ""}`}
      />
    </button>
  );
}

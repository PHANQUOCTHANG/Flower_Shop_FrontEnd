"use client";
import React, { useState } from "react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Product } from "../types";
import { X, ZoomIn } from "lucide-react";
import { WishlistButton } from "@/features/wishlist/components/WishlistButton";

interface GalleryProps {
  product: Product;
  activeImage: number;
  onImageChange: (index: number) => void;
}

export const Gallery: React.FC<GalleryProps> = ({
  product,
  activeImage,
  onImageChange,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const allImages = [
    ...(product.thumbnailUrl
      ? [{ id: "thumbnail", url: product.thumbnailUrl }]
      : []),
    ...(product.images || []),
  ];

  const imageUrl = allImages[activeImage]?.url || "";

  const handlePrev = () => {
    if (activeImage > 0) onImageChange(activeImage - 1);
  };

  const handleNext = () => {
    if (activeImage < allImages.length - 1) onImageChange(activeImage + 1);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Ảnh chính */}
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-[#f9f5f6] to-[#f0ece8] shadow-xl border border-white group cursor-zoom-in">
          {/* Main image */}
          <OptimizedImage
            src={imageUrl}
            alt={product.name}
            fill
            priority
            objectFit="contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="transition-transform duration-700 ease-out group-hover:scale-105 p-4"
          />

          {/* Gradient overlay bottom */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

          {/* Wishlist button — top-left, luôn hiển thị */}
          <div className="absolute top-4 left-4 z-10">
            <WishlistButton productId={product.id} size="lg" />
          </div>

          {/* Zoom button — top-right */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110"
            aria-label="Phóng to ảnh"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Nav buttons — always visible on mobile, hover on desktop */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                disabled={activeImage === 0}
                aria-label="Ảnh trước"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/85 backdrop-blur-sm shadow-lg text-[#1b0d11] border border-white/60 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:bg-[#c8f7d6] hover:scale-110 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white/85"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                disabled={activeImage === allImages.length - 1}
                aria-label="Ảnh tiếp theo"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/85 backdrop-blur-sm shadow-lg text-[#1b0d11] border border-white/60 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:bg-[#c8f7d6] hover:scale-110 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white/85"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                {allImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => onImageChange(idx)}
                    className={`rounded-full transition-all duration-300 ${
                      activeImage === idx
                        ? "w-6 h-2 bg-white shadow-sm"
                        : "w-2 h-2 bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Ảnh ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className={`grid gap-3 ${allImages.length <= 4 ? "grid-cols-4" : "grid-cols-5"}`}>
            {allImages.map((img, idx) => (
              <button
                key={img.id || idx}
                onClick={() => onImageChange(idx)}
                className={`relative aspect-square rounded-2xl overflow-hidden border-2 bg-gradient-to-br from-[#f9f5f6] to-[#f0ece8] transition-all duration-200 ${
                  activeImage === idx
                    ? "border-[#13ec5b] shadow-[0_4px_16px_rgba(19,236,91,0.25)] scale-[0.97]"
                    : "border-transparent hover:border-[#13ec5b]/40 opacity-65 hover:opacity-100"
                }`}
              >
                <OptimizedImage
                  src={img.url}
                  alt={`Ảnh ${idx + 1}`}
                  fill
                  objectFit="contain"
                  sizes="120px"
                  className="p-2 transition-transform duration-300 hover:scale-110"
                />
                {activeImage === idx && (
                  <div className="absolute inset-0 ring-2 ring-inset ring-[#13ec5b]/20 rounded-2xl pointer-events-none" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={() => setLightboxOpen(false)}
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="relative w-full max-w-2xl aspect-[4/5]"
            onClick={(e) => e.stopPropagation()}
          >
            <OptimizedImage
              src={imageUrl}
              alt={product.name}
              fill
              objectFit="contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Lightbox nav */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                disabled={activeImage === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-all disabled:opacity-20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                disabled={activeImage === allImages.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-all disabled:opacity-20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {activeImage + 1} / {allImages.length}
          </p>
        </div>
      )}
    </>
  );
};

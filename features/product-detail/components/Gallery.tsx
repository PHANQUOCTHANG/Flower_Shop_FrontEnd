import React from "react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Product } from "../types";

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
  // thumbnail đầu tiên, sau đó đến các ảnh gallery
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
    <div className="space-y-4">
      {/* Ảnh chính – bg trắng để ảnh contain đẹp */}
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 group">
        <OptimizedImage
          src={imageUrl}
          alt={product.name}
          fill
          priority
          objectFit="contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          className="transition-all duration-500 p-2"
        />

        {/* Nút điều hướng trái/phải */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              disabled={activeImage === 0}
              aria-label="Ảnh trước"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md text-[#1b0d11] border border-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              onClick={handleNext}
              disabled={activeImage === allImages.length - 1}
              aria-label="Ảnh tiếp theo"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md text-[#1b0d11] border border-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Chỉ số ảnh */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {activeImage + 1} / {allImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {allImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => onImageChange(idx)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 bg-white transition-all ${
                activeImage === idx
                  ? "border-[#13ec5b] shadow-md scale-95"
                  : "border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-300"
              }`}
            >
              <OptimizedImage
                src={img.url}
                alt={`Ảnh ${idx + 1}`}
                fill
                objectFit="contain"
                sizes="120px"
                className="p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

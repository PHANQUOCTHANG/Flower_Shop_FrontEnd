import React from "react";
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
  const images = product.images || [];
  const imageUrl = images[activeImage]?.url || product.thumbnailUrl || "";

  return (
    <div className="space-y-4">
      {/* Ảnh chính */}
      <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => onImageChange(idx)}
              className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                activeImage === idx
                  ? "border-[#13ec5b] scale-95"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img.url}
                alt={`Thumbnail ${idx}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

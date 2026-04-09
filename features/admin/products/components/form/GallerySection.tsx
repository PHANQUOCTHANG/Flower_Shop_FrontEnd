"use client";
import { forwardRef } from "react";
import Image from "next/image";

export interface ProductImage {
  id?: string;
  url: string;
  isPrimary?: boolean;
}

interface GallerySectionProps {
  images: ProductImage[];
  onFilesAdd: (files: File[]) => void;
  onImageRemove: (index: number) => void;
  isDragging?: boolean;
  onDragEnter?: () => void;
  onDragLeave?: () => void;
}

const GallerySection = forwardRef<HTMLDivElement, GallerySectionProps>(
  (
    {
      images,
      onFilesAdd,
      onImageRemove,
      isDragging = false,
      onDragEnter,
      onDragLeave,
    },
    ref,
  ) => {
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onDragLeave?.();

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/"),
      );
      if (files.length > 0) {
        onFilesAdd(files);
      }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onFilesAdd(files);
      }
      e.target.value = "";
    };

    return (
      <section
        ref={ref}
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold mb-6">🖼️ Thư viện ảnh</h3>

        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-[#ee2b5b] bg-red-50"
              : "border-slate-300 hover:border-slate-400"
          }`}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="gallery-upload"
          />
          <label htmlFor="gallery-upload" className="cursor-pointer block">
            <div className="text-4xl mb-2">📤</div>
            <p className="text-sm font-semibold text-slate-700">
              Kéo ảnh vào đây hoặc nhấp để chọn
            </p>
            <p className="text-xs text-slate-500 mt-1">Hỗ trợ JPG, PNG, WebP</p>
          </label>
        </div>

        {/* Images Grid */}
        {images.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-slate-700 mb-3">
              ({images.length}) Ảnh đã tải
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative bg-slate-100 rounded-lg overflow-hidden group"
                >
                  <div className="relative w-full h-32 bg-slate-200 animate-pulse">
                    <Image
                      src={image.url}
                      alt={`Product image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover opacity-0 transition-opacity duration-500"
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.classList.remove('opacity-0');
                        target.parentElement?.classList.remove('animate-pulse');
                      }}
                    />
                  </div>
                  <button
                    onClick={() => onImageRemove(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    type="button"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    );
  },
);

GallerySection.displayName = "GallerySection";

export default GallerySection;

"use client";
import { forwardRef } from "react";
import Image from "next/image";

interface ThumbnailSectionProps {
  thumbnail: string | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  isDragging?: boolean;
  onDragEnter?: () => void;
  onDragLeave?: () => void;
}

const ThumbnailSection = forwardRef<HTMLDivElement, ThumbnailSectionProps>(
  (
    {
      thumbnail,
      onFileSelect,
      onRemove,
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
        onFileSelect(files[0]);
      }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
      e.target.value = "";
    };

    return (
      <section
        ref={ref}
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold mb-6">🎯 Ảnh đại diện</h3>

        {thumbnail ? (
          // Show existing thumbnail
          <div className="mb-4">
            <div className="relative w-full h-48 bg-slate-200 animate-pulse rounded-xl overflow-hidden">
              <Image
                src={thumbnail}
                alt="Thumbnail"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover opacity-0 transition-opacity duration-500"
                onLoad={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.classList.remove('opacity-0');
                  target.parentElement?.classList.remove('animate-pulse');
                }}
              />
            </div>
            <button
              onClick={onRemove}
              type="button"
              className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg font-medium text-sm hover:bg-red-600 transition-colors w-full"
            >
              Xoá ảnh
            </button>
          </div>
        ) : (
          // Show drag & drop area
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
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="thumbnail-upload"
            />
            <label htmlFor="thumbnail-upload" className="cursor-pointer block">
              <div className="text-4xl mb-2">📸</div>
              <p className="text-sm font-semibold text-slate-700">
                Kéo ảnh vào đây hoặc nhấp để chọn
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Hỗ trợ JPG, PNG, WebP
              </p>
            </label>
          </div>
        )}

        <p className="text-xs text-slate-500 mt-3">
          Ảnh đại diện sẽ hiển thị trong danh sách sản phẩm
        </p>
      </section>
    );
  },
);

ThumbnailSection.displayName = "ThumbnailSection";

export default ThumbnailSection;

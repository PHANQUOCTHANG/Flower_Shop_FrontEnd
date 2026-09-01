"use client";
import { useState } from "react";
import { forwardRef } from "react";
import { GripVertical, Images, Star, UploadCloud, X } from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { SectionHeading } from "./SectionHeading";

export interface ProductImage {
  id?: string;
  url: string;
  isPrimary?: boolean;
}

interface GallerySectionProps {
  images: ProductImage[];
  onFilesAdd: (files: File[]) => void;
  onImageRemove: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onSetPrimary: (index: number) => void;
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
      onReorder,
      onSetPrimary,
      isDragging = false,
      onDragEnter,
      onDragLeave,
    },
    ref,
  ) => {
    // Index ảnh đang được kéo để sắp xếp lại — khác với isDragging (kéo file
    // từ ngoài vào khung upload).
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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
      if (files.length > 0) onFilesAdd(files);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) onFilesAdd(files);
      e.target.value = "";
    };

    // ── Kéo-thả sắp xếp lại thứ tự ảnh đã có ──────────────────────────────
    const handleItemDragStart = (index: number) => {
      setDraggedIndex(index);
    };

    const handleItemDragOver = (
      e: React.DragEvent<HTMLDivElement>,
      index: number,
    ) => {
      e.preventDefault();
      e.stopPropagation();
      if (draggedIndex === null || draggedIndex === index) return;
      setDragOverIndex(index);
    };

    const handleItemDrop = (
      e: React.DragEvent<HTMLDivElement>,
      index: number,
    ) => {
      e.preventDefault();
      e.stopPropagation();
      if (draggedIndex !== null && draggedIndex !== index) {
        onReorder(draggedIndex, index);
      }
      setDraggedIndex(null);
      setDragOverIndex(null);
    };

    const handleItemDragEnd = () => {
      setDraggedIndex(null);
      setDragOverIndex(null);
    };

    return (
      <section
        ref={ref}
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
      >
        <SectionHeading icon={Images} title="Thư viện ảnh" />
        <p className="text-sm text-slate-500 -mt-4 mb-6">
          Ảnh đầu tiên là ảnh đại diện — hiển thị trong danh sách sản phẩm,
          giỏ hàng và trang chi tiết.
        </p>

        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-[#13ec5b] bg-red-50"
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
            <UploadCloud className="mx-auto mb-2 text-slate-400" size={36} />
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
              ({images.length}) Ảnh đã tải — kéo để sắp xếp, ảnh đầu tiên là ảnh
              đại diện
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => {
                const isPrimary = index === 0;
                return (
                  <div
                    key={image.id || index}
                    draggable
                    onDragStart={() => handleItemDragStart(index)}
                    onDragOver={(e) => handleItemDragOver(e, index)}
                    onDrop={(e) => handleItemDrop(e, index)}
                    onDragEnd={handleItemDragEnd}
                    className={`relative group rounded-xl overflow-hidden bg-slate-100 border-2 cursor-grab active:cursor-grabbing transition-all ${
                      dragOverIndex === index
                        ? "border-[#13ec5b] scale-[0.97]"
                        : isPrimary
                          ? "border-[#13ec5b]/60"
                          : "border-slate-200"
                    } ${draggedIndex === index ? "opacity-40" : ""}`}
                  >
                    {/* aspect-square giữ tỷ lệ 1:1 cho tất cả ảnh gallery */}
                    <div className="relative aspect-square pointer-events-none">
                      <OptimizedImage
                        src={image.url}
                        alt={`Ảnh sản phẩm ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 300px"
                      />
                    </div>

                    {/* Tay cầm kéo-thả */}
                    <div className="absolute top-2 left-2 bg-black/40 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all">
                      <GripVertical size={14} />
                    </div>

                    {/* Badge ảnh đại diện */}
                    {isPrimary ? (
                      <span className="absolute bottom-2 left-2 flex items-center gap-1 bg-[#13ec5b] text-[#0d1b12] text-[10px] font-bold px-2 py-1 rounded-full shadow">
                        <Star size={10} fill="currentColor" /> Đại diện
                      </span>
                    ) : (
                      <button
                        onClick={() => onSetPrimary(index)}
                        type="button"
                        className="absolute bottom-2 left-2 bg-white/90 text-slate-600 text-[10px] font-semibold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow"
                      >
                        Đặt làm đại diện
                      </button>
                    )}

                    <button
                      onClick={() => onImageRemove(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md"
                      type="button"
                      aria-label="Xoá ảnh"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    );
  },
);

GallerySection.displayName = "GallerySection";

export default GallerySection;

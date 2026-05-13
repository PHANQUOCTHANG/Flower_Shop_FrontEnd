"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { getCloudinaryUrl } from "@/utils/cloudinary";

interface OptimizedImageProps extends Omit<ImageProps, "src"> {
  src: string | null | undefined;
  fallbackSrc?: string;
  /** Cloudinary crop mode. Default "limit" (no crop). */
  crop?: string;
  gravity?: string;
  /** CSS object-fit. Default "cover". Pass "contain" for gallery/detail views. */
  objectFit?: "cover" | "contain";
  /** Show shimmer skeleton while loading. Default true. */
  showSkeleton?: boolean;
}

const DEFAULT_FALLBACK =
  "https://res.cloudinary.com/dvp98f98f/image/upload/v1713672000/placeholder_flower.png";

/** Skeleton shimmer overlay — hiển thị khi ảnh chưa load xong */
function Shimmer() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 block overflow-hidden rounded-[inherit]"
      style={{ zIndex: 1 }}
    >
      <span
        className="absolute inset-0 block"
        style={{
          background:
            "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s infinite linear",
        }}
      />
    </span>
  );
}

/**
 * Hiển thị ảnh tối ưu hóa qua Next.js Image + Cloudinary transformations.
 *
 * Features:
 * - Skeleton shimmer khi ảnh đang load
 * - Fade-in mượt khi ảnh xuất hiện
 * - Fallback tự động khi lỗi
 * - lazy loading mặc định (Next.js Image)
 *
 * Fill mode: đặt bên trong container có `position: relative` + chiều cao xác định.
 *   Component render <Image fill> trực tiếp, KHÔNG thêm wrapper div.
 *
 * Fixed-size mode: truyền width + height.
 */
export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  fill,
  className,
  crop = "limit",
  gravity = "auto",
  objectFit = "cover",
  fallbackSrc = DEFAULT_FALLBACK,
  showSkeleton = true,
  sizes,
  ...props
}: OptimizedImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const resolvedSrc = hasError
    ? fallbackSrc
    : getCloudinaryUrl(src, {
        width: fill ? undefined : (width as number | undefined),
        height: fill ? undefined : (height as number | undefined),
        crop,
        gravity,
      }) || fallbackSrc;

  const fitClass = objectFit === "contain" ? "object-contain" : "object-cover";

  // Ảnh bắt đầu transparent, fade in khi load xong
  const imageClass = [
    "transition-opacity duration-500",
    isLoaded ? "opacity-100" : "opacity-0",
    fitClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const isBlobOrDataUrl =
    resolvedSrc.startsWith("blob:") || resolvedSrc.startsWith("data:");

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => {
    setHasError(true);
    setIsLoaded(true); // Fallback cũng cần hiện ra
  };

  if (fill) {
    return (
      <>
        {showSkeleton && !isLoaded && <Shimmer />}
        <Image
          src={resolvedSrc}
          alt={alt || ""}
          fill
          sizes={sizes}
          className={imageClass}
          unoptimized={isBlobOrDataUrl}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      </>
    );
  }

  return (
    <span
      className="relative inline-block overflow-hidden rounded-[inherit]"
      style={{ width, height, display: "block" }}
    >
      {showSkeleton && !isLoaded && <Shimmer />}
      <Image
        src={resolvedSrc}
        alt={alt || ""}
        width={width}
        height={height}
        sizes={sizes}
        className={imageClass}
        unoptimized={isBlobOrDataUrl}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </span>
  );
};

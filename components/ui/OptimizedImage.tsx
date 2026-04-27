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
}

const DEFAULT_FALLBACK =
  "https://res.cloudinary.com/dvp98f98f/image/upload/v1713672000/placeholder_flower.png";

/**
 * Hiển thị ảnh tối ưu hóa qua Next.js Image + Cloudinary transformations.
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
  sizes,
  ...props
}: OptimizedImageProps) => {
  const [hasError, setHasError] = useState(false);

  const resolvedSrc = hasError
    ? fallbackSrc
    : getCloudinaryUrl(src, {
        width: fill ? undefined : (width as number | undefined),
        height: fill ? undefined : (height as number | undefined),
        crop,
        gravity,
      }) || fallbackSrc;

  const fitClass = objectFit === "contain" ? "object-contain" : "object-cover";
  const imageClass = ["transition-opacity duration-300", fitClass, className]
    .filter(Boolean)
    .join(" ");

  const isBlobOrDataUrl = resolvedSrc.startsWith("blob:") || resolvedSrc.startsWith("data:");

  if (fill) {
    // Render trực tiếp vào parent relative — không thêm wrapper div
    return (
      <Image
        src={resolvedSrc}
        alt={alt || ""}
        fill
        sizes={sizes}
        className={imageClass}
        unoptimized={isBlobOrDataUrl}
        onError={() => setHasError(true)}
        {...props}
      />
    );
  }

  return (
    <Image
      src={resolvedSrc}
      alt={alt || ""}
      width={width}
      height={height}
      sizes={sizes}
      className={imageClass}
      unoptimized={isBlobOrDataUrl}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};

import type { ImageLoaderProps } from "next/image";
import { buildCloudinaryUrl, isCloudinaryUrl } from "@/utils/cloudinary";

/**
 * Loader tuỳ chỉnh cho next/image: giao toàn bộ việc resize + nén + chọn định
 * dạng (f_auto,q_auto) cho Cloudinary, thay vì để Next.js/Vercel tải ảnh
 * Cloudinary đã tối ưu về rồi nén lại lần 2 (nguyên nhân chính gây ảnh mờ).
 *
 * `width` do Next tự tính theo `sizes` + `deviceSizes`/`imageSizes` khai báo
 * trong next.config.ts — mỗi breakpoint sẽ gọi loader này với width tương ứng,
 * nên vẫn giữ được srcset responsive dù bỏ qua bộ tối ưu ảnh mặc định.
 *
 * `crop`/`gravity` không nằm trong chữ ký loader của Next nên được
 * OptimizedImage mã hoá vào query string của `src` (vd `?_crop=fill`) — loader
 * đọc ra rồi bóc khỏi URL trước khi trả về.
 */
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  if (!isCloudinaryUrl(src)) return src;

  const [baseUrl, queryString] = src.split("?");
  const params = new URLSearchParams(queryString);

  return buildCloudinaryUrl(baseUrl, {
    width,
    quality: quality ?? "auto:best",
    crop: params.get("_crop") ?? "limit",
    gravity: params.get("_gravity") ?? "auto",
  });
}

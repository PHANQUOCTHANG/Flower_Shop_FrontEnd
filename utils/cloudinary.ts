/**
 * Tiện ích xử lý URL Cloudinary để tối ưu hóa ảnh.
 *
 * Logic build transform dùng chung giữa `cloudinaryLoader` (loader của
 * next/image, quyết định width theo từng breakpoint) và các nơi hiếm khi cần
 * render ảnh Cloudinary ngoài next/image (vd CSS background-image).
 *
 * Mặc định dùng c_limit: scale ảnh vừa khung mà KHÔNG crop.
 * Nếu muốn crop fill (avatar, thumbnail vuông), truyền crop="fill".
 */

export const CLOUDINARY_HOST = "res.cloudinary.com";

export const isCloudinaryUrl = (url: string | null | undefined): boolean =>
  !!url && url.includes(CLOUDINARY_HOST);

interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  quality?: string | number;
  format?: string;
  crop?: string;
  gravity?: string;
}

/** Build URL Cloudinary đã áp transform, hoặc trả về nguyên url nếu không phải Cloudinary. */
export const buildCloudinaryUrl = (
  url: string,
  options: CloudinaryTransformOptions = {},
): string => {
  if (!isCloudinaryUrl(url)) return url;

  // Đã có transformation sẵn trong URL → không transform chồng lên
  if (url.includes("/upload/f_") || url.includes("/upload/q_")) return url;

  const {
    width,
    height,
    quality = "auto:best",
    format = "auto",
    crop = "limit", // Mặc định: không cắt ảnh
    gravity = "auto",
  } = options;

  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  const t: string[] = [`f_${format}`, `q_${quality}`, `c_${crop}`];

  // Chỉ thêm gravity khi thực sự cần (fill/crop mode)
  if (crop !== "limit" && crop !== "fit" && crop !== "scale") {
    t.push(`g_${gravity}`);
  }

  if (width) t.push(`w_${width}`);
  if (height) t.push(`h_${height}`);

  return `${parts[0]}/upload/${t.join(",")}/${parts[1]}`;
};

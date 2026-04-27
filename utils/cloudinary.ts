/**
 * Tiện ích xử lý URL Cloudinary để tối ưu hóa ảnh.
 *
 * Mặc định dùng c_limit: scale ảnh vừa khung mà KHÔNG crop.
 * Nếu muốn crop fill (avatar, thumbnail vuông), truyền crop="fill".
 */

interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: string | number;
  format?: string;
  crop?: string;
  gravity?: string;
}

export const getCloudinaryUrl = (
  url: string | null | undefined,
  options: CloudinaryOptions = {},
): string => {
  if (!url) return "";

  // Không phải Cloudinary → trả về gốc
  if (!url.includes("res.cloudinary.com")) return url;

  // Đã có transformation → không transform lại
  if (url.includes("/upload/f_") || url.includes("/upload/q_")) return url;

  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "limit",   // Mặc định: không cắt ảnh
    gravity = "auto",
  } = options;

  // Tách URL tại /upload/
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

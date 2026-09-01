// Suy ra field "thumbnail" gửi lên API từ ảnh đầu tiên trong thư viện —
// thay cho khối upload "Ảnh đại diện" riêng đã bị gỡ khỏi UI.
import { UploadedImage } from "../hooks/useProductForm";

interface ResolveThumbnailParams {
  images: UploadedImage[];
  initialPrimaryImageId: string | null;
  hadInitialThumbnail: boolean;
}

interface ThumbnailResult {
  file?: File;
  clear?: boolean;
}

export async function resolveThumbnailForSubmit({
  images,
  initialPrimaryImageId,
  hadInitialThumbnail,
}: ResolveThumbnailParams): Promise<ThumbnailResult> {
  const primary = images[0];

  if (!primary) {
    return hadInitialThumbnail ? { clear: true } : {};
  }

  if (primary.file) {
    return { file: primary.file };
  }

  // Ảnh đại diện không đổi so với lúc tải trang — không upload lại.
  if (primary.id === initialPrimaryImageId) {
    return {};
  }

  // Ảnh có sẵn vừa được kéo lên làm đại diện — tải lại thành blob để
  // upload làm thumbnail, vì backend lưu thumbnail như 1 asset riêng.
  const response = await fetch(primary.url);
  const blob = await response.blob();
  return {
    file: new File([blob], primary.name || "thumbnail.jpg", {
      type: blob.type || "image/jpeg",
    }),
  };
}

// Type definitions & builder cho FormData
export interface UploadedImage {
  url: string;
  file?: File;
}

export interface ThumbnailData {
  url?: string;
  file?: File;
}

export interface FormData {
  name: string;
  shortDescription: string;
  description: string;
  price: string;
  comparePrice: string;
  sku: string;
  status: string;
  categoryIds: string[];
  images: UploadedImage[];
  deletedImageIds: string[];
  thumbnail?: ThumbnailData;
  originalThumbnailUrl?: string | null;
}

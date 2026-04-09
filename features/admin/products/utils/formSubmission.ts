// Utility functions cho form submission & data handling


import type { FormData } from "@/features/admin/products/utils/formDataBuilder";
import { PRODUCT_MESSAGES } from "../constants/productConfig";

// Interface cho form submission options
export interface FormSubmitOptions {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

// Build FormData từ product data
export function buildFormData(data: FormData): FormData {
  const formDataToSend = new FormData();

  formDataToSend.append("name", data.name.trim());
  if (data.shortDescription?.trim()) {
    formDataToSend.append("shortDescription", data.shortDescription.trim());
  }
  if (data.description?.trim()) {
    formDataToSend.append("description", data.description.trim());
  }

  formDataToSend.append("price", String(parseFloat(data.price) || 0));
  if (data.comparePrice) {
    formDataToSend.append(
      "comparePrice",
      String(parseFloat(data.comparePrice)),
    );
  }

  if (data.sku?.trim()) {
    formDataToSend.append("sku", data.sku.trim());
  }
  formDataToSend.append("status", data.status);

  // Thêm categories
  if (data.categoryIds && data.categoryIds.length > 0) {
    data.categoryIds.forEach((id) => {
      formDataToSend.append("categoryIds", id);
    });
  }

  // Xử lý thumbnail
  if (data.thumbnail?.file) {
    formDataToSend.append("thumbnail", data.thumbnail.file);
  } else if (!data.thumbnail && data.originalThumbnailUrl) {
    formDataToSend.append("thumbnailEmpty", "true");
  }

  // Xử lý gallery images
  if (data.images && data.images.length > 0) {
    data.images.forEach((img) => {
      if (img.file) {
        formDataToSend.append("images", img.file);
      }
    });
  }

  // Xử lý deleted images
  if (data.deletedImageIds && data.deletedImageIds.length > 0) {
    data.deletedImageIds.forEach((id) => {
      formDataToSend.append("deletedImageIds", id);
    });
  }

  return formDataToSend as unknown as FormData;
}

// Log FormData cho debugging
export function logFormData(data: FormData): void {
  console.log("📦 Dữ liệu gửi:");
  for (const [key, value] of (data as any).entries()) {
    if (value instanceof File) {
      console.log(` ${key}: File(${value.name}, ${value.size} bytes)`);
    } else {
      console.log(` ${key}: ${value}`);
    }
  }
}

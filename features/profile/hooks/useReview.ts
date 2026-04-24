import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";

interface CreateReviewPayload {
  productId: string;
  orderId?: string;
  rating: number;
  content?: string;
  files?: File[]; // File thực tế — gửi kèm multipart/form-data
}

export const useCreateReview = () => {
  return useMutation({
    mutationFn: async (payload: CreateReviewPayload) => {
      const formData = new FormData();

      formData.append("productId", payload.productId);
      formData.append("rating", String(payload.rating));

      if (payload.orderId) formData.append("orderId", payload.orderId);
      if (payload.content) formData.append("content", payload.content);

      // Append từng file — backend multer đọc field "media"
      payload.files?.forEach((file) => formData.append("media", file));

      const { data } = await api.post("/reviews", formData);
      return data;
    },
  });
};

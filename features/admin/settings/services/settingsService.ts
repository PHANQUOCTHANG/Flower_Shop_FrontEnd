import api from "@/lib/axios";
import { ApiResponse } from "@/types/response";
import { SystemSettings } from "../types/settings.types";

export const settingsService = {
  // Lấy toàn bộ settings (public)
  async getAllSettings() {
    const res = await api.get<ApiResponse<SystemSettings>>("/settings");

    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Không thể tải cấu hình");
    }

    return res.data.data;
  },

  // Cập nhật 1 setting cụ thể (cần quyền admin)
  async updateSetting(key: string, value: any) {
    const res = await api.put<ApiResponse<any>>(`/settings/${key}`, value);

    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Cập nhật thất bại");
    }

    return res.data.data;
  },

  // Upload ảnh dùng chung cho settings
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append("image", file);
    const res = await api.post<ApiResponse<{ url: string; publicId: string }>>(
      "/settings/upload-image",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Upload ảnh thất bại");
    }

    return res.data.data;
  },
};

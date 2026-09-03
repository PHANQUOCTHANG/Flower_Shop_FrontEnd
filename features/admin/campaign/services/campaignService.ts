import api from "@/lib/axios";
import { ApiResponse } from "@/types/response";
import { SaleCampaign } from "@/types/campaign";
import { AdminCampaignsParams, CreateCampaignDto, UpdateCampaignDto } from "../types";

export const campaignService = {
  async getCampaigns(params?: AdminCampaignsParams) {
    const res = await api.get<ApiResponse<SaleCampaign[]>>("/campaigns", { params });
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Fetch failed");
    }
    return {
      campaigns: res.data.data ?? [],
      meta: res.data.meta,
      message: res.data.message,
    };
  },

  async getCampaignById(id: string) {
    const res = await api.get<ApiResponse<SaleCampaign>>(`/campaigns/${id}`);
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Fetch failed");
    }
    return res.data.data;
  },

  async createCampaign(data: CreateCampaignDto) {
    const res = await api.post<ApiResponse<SaleCampaign>>("/campaigns", data);
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Create failed");
    }
    return res.data.data;
  },

  // Backend dùng PUT (không phải PATCH như product) cho cập nhật toàn phần
  async updateCampaign(id: string, data: UpdateCampaignDto) {
    const res = await api.put<ApiResponse<SaleCampaign>>(`/campaigns/${id}`, data);
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Update failed");
    }
    return res.data.data;
  },

  async updateCampaignStatus(id: string, status: string) {
    const res = await api.patch<ApiResponse<SaleCampaign>>(`/campaigns/${id}/status`, {
      status,
    });
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Update status failed");
    }
    return res.data.data;
  },

  async deleteCampaign(id: string) {
    const res = await api.delete<ApiResponse<null>>(`/campaigns/${id}`);
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Delete failed");
    }
    return true;
  },
};

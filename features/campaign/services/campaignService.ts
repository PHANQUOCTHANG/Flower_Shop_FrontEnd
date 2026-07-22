import api from "@/lib/axios";
import { SaleCampaign } from "@/types/campaign";

export const campaignService = {
  getActiveCampaign: async (): Promise<SaleCampaign | null> => {
    try {
      const response = await api.get<{ data: SaleCampaign }>("/campaigns/active");
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi lấy campaign:", error);
      return null;
    }
  },

  getActiveCampaignItems: async (page = 1, limit = 8) => {
    const res = await api.get<{
      data: any[];
      campaign: SaleCampaign | null;
      meta: { total: number; page: number; limit: number; totalPages: number };
    }>("/campaigns/active/items", { params: { page, limit } });
    return res.data;
  },

  // Các hàm dành cho Admin
  getCampaigns: async () => {
    const res = await api.get("/campaigns");
    return res.data.data;
  },

  createCampaign: async (data: any) => {
    const res = await api.post("/campaigns", data);
    return res.data.data;
  }
};

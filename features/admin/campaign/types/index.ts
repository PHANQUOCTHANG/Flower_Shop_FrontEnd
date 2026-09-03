export * from "@/types/campaign";

export interface AdminCampaignsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "DRAFT" | "SCHEDULED" | "ACTIVE" | "ENDED";
  type?: "FLASH_SALE" | "EVENT_SALE";
}

export interface CampaignItemDto {
  productId: string;
  discountValue: number;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  salePrice: number;
  limitQuantity?: number | null;
}

export interface CreateCampaignDto {
  name: string;
  description?: string | null;
  type: "FLASH_SALE" | "EVENT_SALE";
  status: "DRAFT" | "SCHEDULED" | "ACTIVE" | "ENDED";
  startDate: string;
  endDate: string;
  bannerUrl?: string | null;
  isActive: boolean;
  items?: CampaignItemDto[];
}

export type UpdateCampaignDto = Partial<CreateCampaignDto>;

// Trạng thái nào được phép chuyển sang trạng thái nào — PHẢI đồng bộ tay với
// ALLOWED_STATUS_TRANSITIONS ở backend/src/module/campaign/campaign.service.ts
export const ALLOWED_STATUS_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ["SCHEDULED", "ACTIVE"],
  SCHEDULED: ["DRAFT", "ACTIVE", "ENDED"],
  ACTIVE: ["ENDED"],
  ENDED: [],
};

export const CAMPAIGN_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Nháp",
  SCHEDULED: "Đã lên lịch",
  ACTIVE: "Đang chạy",
  ENDED: "Đã kết thúc",
};

export const CAMPAIGN_TYPE_LABELS: Record<string, string> = {
  FLASH_SALE: "Flash Sale",
  EVENT_SALE: "Sự kiện",
};

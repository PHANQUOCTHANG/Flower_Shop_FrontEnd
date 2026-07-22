import { Product } from "./product";

export interface CampaignItem {
  id: string;
  productId: string;
  discountValue: number;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  salePrice: number;
  limitQuantity?: number | null;
  soldQuantity: number;
  product?: Product;
}

export interface SaleCampaign {
  id: string;
  name: string;
  description?: string | null;
  type: "FLASH_SALE" | "EVENT_SALE";
  status: "DRAFT" | "SCHEDULED" | "ACTIVE" | "ENDED";
  startDate: string;
  endDate: string;
  bannerUrl?: string | null;
  isActive: boolean;
  items?: CampaignItem[];
}

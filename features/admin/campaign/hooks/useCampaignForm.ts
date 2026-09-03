import { useState, useCallback } from "react";
import { SaleCampaign, CampaignItem } from "@/types/campaign";
import { CampaignItemDto, CreateCampaignDto } from "../types";
import { Product } from "@/types/product";

export interface CampaignItemDraft extends CampaignItemDto {
  // Dữ liệu hiển thị (không gửi lên server) — lấy từ product picker hoặc từ
  // campaign.items khi load trang edit.
  productName: string;
  productThumbnail: string | null;
  productPrice: number;
  soldQuantity?: number; // read-only, chỉ có khi edit
}

const toDatetimeLocal = (iso: string) => {
  // datetime-local input cần "YYYY-MM-DDTHH:mm" theo giờ local, không phải UTC
  const date = new Date(iso);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

const defaultStart = () => toDatetimeLocal(new Date().toISOString());
const defaultEnd = () => toDatetimeLocal(new Date(Date.now() + 3 * 86400000).toISOString());

export function useCampaignForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"FLASH_SALE" | "EVENT_SALE">("FLASH_SALE");
  const [status, setStatus] = useState<"DRAFT" | "SCHEDULED" | "ACTIVE" | "ENDED">("DRAFT");
  const [startDate, setStartDate] = useState(defaultStart());
  const [endDate, setEndDate] = useState(defaultEnd());
  const [bannerUrl, setBannerUrl] = useState("");
  const [items, setItems] = useState<CampaignItemDraft[]>([]);

  const populateForm = useCallback((campaign: SaleCampaign) => {
    setName(campaign.name);
    setDescription(campaign.description ?? "");
    setType(campaign.type);
    setStatus(campaign.status);
    setStartDate(toDatetimeLocal(campaign.startDate));
    setEndDate(toDatetimeLocal(campaign.endDate));
    setBannerUrl(campaign.bannerUrl ?? "");
    setItems(
      (campaign.items ?? []).map((item: CampaignItem) => ({
        productId: item.productId,
        discountValue: item.discountValue,
        discountType: item.discountType,
        salePrice: item.salePrice,
        limitQuantity: item.limitQuantity ?? undefined,
        soldQuantity: item.soldQuantity,
        productName: item.product?.name ?? "",
        productThumbnail: item.product?.thumbnailUrl ?? null,
        productPrice: item.product?.price ?? 0,
      })),
    );
  }, []);

  const addProductAsItem = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.some((i) => i.productId === product.id)) return prev;
      const discountValue = 10;
      const salePrice = Math.round(product.price * 0.9);
      return [
        ...prev,
        {
          productId: product.id,
          discountValue,
          discountType: "PERCENTAGE",
          salePrice,
          limitQuantity: undefined,
          productName: product.name,
          productThumbnail: product.thumbnailUrl,
          productPrice: product.price,
        },
      ];
    });
  }, []);

  const updateItem = useCallback((productId: string, patch: Partial<CampaignItemDraft>) => {
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, ...patch } : i)));
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const toDto = useCallback((): CreateCampaignDto => {
    return {
      name: name.trim(),
      description: description.trim() || null,
      type,
      status,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      bannerUrl: bannerUrl.trim() || null,
      isActive: true,
      items: items.map((i) => ({
        productId: i.productId,
        discountValue: Number(i.discountValue),
        discountType: i.discountType,
        salePrice: Number(i.salePrice),
        limitQuantity: i.limitQuantity != null && i.limitQuantity !== ("" as any) ? Number(i.limitQuantity) : null,
      })),
    };
  }, [name, description, type, status, startDate, endDate, bannerUrl, items]);

  // Validate phía client, khớp với validate backend — báo lỗi sớm trước khi gửi request
  const validate = useCallback((): string | null => {
    if (name.trim().length < 3) return "Tên chiến dịch tối thiểu 3 ký tự";
    if (new Date(endDate) <= new Date(startDate)) return "Ngày kết thúc phải lớn hơn ngày bắt đầu";
    const productIds = new Set(items.map((i) => i.productId));
    if (productIds.size !== items.length) return "Không được thêm trùng sản phẩm trong cùng một chiến dịch";
    for (const item of items) {
      if (item.salePrice < 0) return `Giá sale của "${item.productName}" không được âm`;
      if (
        item.soldQuantity != null &&
        item.soldQuantity > 0 &&
        item.limitQuantity != null &&
        Number(item.limitQuantity) < item.soldQuantity
      ) {
        return `Giới hạn số lượng của "${item.productName}" không được thấp hơn số đã bán (${item.soldQuantity})`;
      }
    }
    return null;
  }, [name, startDate, endDate, items]);

  return {
    name, setName,
    description, setDescription,
    type, setType,
    status, setStatus,
    startDate, setStartDate,
    endDate, setEndDate,
    bannerUrl, setBannerUrl,
    items,
    populateForm,
    addProductAsItem,
    updateItem,
    removeItem,
    toDto,
    validate,
  };
}

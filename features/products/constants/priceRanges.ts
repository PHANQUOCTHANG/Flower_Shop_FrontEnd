// Danh sách các khoảng giá cho bộ lọc
export const PRICE_RANGES = [
  { value: "all", label: "Tất cả giá", min: null, max: null },
  { value: "under-500k", label: "Dưới 500.000₫", min: 1, max: 499000 },
  {
    value: "500k-1m",
    label: "500.000₫ - 1.000.000₫",
    min: 500000,
    max: 1000000,
  },
  {
    value: "1m-2m",
    label: "1.000.000₫ - 2.000.000₫",
    min: 1000000,
    max: 2000000,
  },
  { value: "above-2m", label: "Trên 2.000.000₫", min: 2000000, max: null },
] as const;

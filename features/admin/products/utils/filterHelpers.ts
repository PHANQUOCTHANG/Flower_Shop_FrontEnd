// Utility functions cho filter & URL management
import { FILTER_DEFAULTS } from "../constants/productConfig";

// Normalize category value - "Tất cả" hoặc undefined -> undefined
export function normalizeCategoryValue(value?: string): string | undefined {
  if (!value || value === "Tất cả") return undefined;
  return value;
}

// Build query parameters từ filter state
export function buildQueryParams(filters: {
  search: string;
  category?: string;
  page: number;
  sort: string;
  status: string;
  minPrice: number | null;
  maxPrice: number | null;
}): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);

  const normalizedCat = normalizeCategoryValue(filters.category);
  if (normalizedCat) params.set("category", normalizedCat);

  if (filters.page > 1) params.set("page", filters.page.toString());
  if (filters.sort !== FILTER_DEFAULTS.SORT_NEWEST)
    params.set("sort", filters.sort);
  if (filters.status && filters.status !== FILTER_DEFAULTS.STATUS_ALL) {
    params.set("status", filters.status);
  }
  if (filters.minPrice !== null)
    params.set("minPrice", filters.minPrice.toString());
  if (filters.maxPrice !== null)
    params.set("maxPrice", filters.maxPrice.toString());

  return params;
}

// Check có filter nào được áp dụng không
export function hasActiveFilters(appliedFilters: {
  search: string;
  category?: string;
  sort: string;
  status: string;
  minPrice: number | null;
  maxPrice: number | null;
}): boolean {
  return (
    appliedFilters.search !== "" ||
    appliedFilters.category !== undefined ||
    appliedFilters.sort !== FILTER_DEFAULTS.SORT_NEWEST ||
    appliedFilters.status !== FILTER_DEFAULTS.STATUS_ALL ||
    appliedFilters.minPrice !== null ||
    appliedFilters.maxPrice !== null
  );
}

// Parse query parameters từ URL
export function parseQueryParams(searchParams: URLSearchParams) {
  const keyword = searchParams.get("search") || FILTER_DEFAULTS.SEARCH_DEFAULT;
  const category = normalizeCategoryValue(
    searchParams.get("category") || undefined,
  );
  const page = parseInt(
    searchParams.get("page") || String(FILTER_DEFAULTS.PAGE_DEFAULT),
  );
  const sort = searchParams.get("sort") || FILTER_DEFAULTS.SORT_NEWEST;
  const status = searchParams.get("status") || FILTER_DEFAULTS.STATUS_ALL;
  const minPrice = searchParams.get("minPrice")
    ? parseInt(searchParams.get("minPrice")!)
    : null;
  const maxPrice = searchParams.get("maxPrice")
    ? parseInt(searchParams.get("maxPrice")!)
    : null;

  return { keyword, category, page, sort, status, minPrice, maxPrice };
}

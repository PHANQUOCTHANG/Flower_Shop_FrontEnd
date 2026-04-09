// Cấu hình chung cho admin products
export const PRODUCT_CONFIG = {
  // Routes
  PRODUCTS_LIST_ROUTE: "/admin/products" as const,
  ADD_PRODUCT_ROUTE: "/admin/products/add" as const,

  // UI config
  BACKGROUND_COLOR: "#f8f6f6",
  PRIMARY_COLOR: "#ee2b5b",
  DARK_PRIMARY: "#d42552",

  // Time delays
  ALERT_DURATION: 5000,
  REDIRECT_DELAY: 1500,

  // Pagination
  ITEMS_PER_PAGE: 10,
} as const;

// Messages cho product form
export const PRODUCT_MESSAGES = {
  UPDATE_SUCCESS: "Sản phẩm đã được cập nhật thành công!",
  UPDATE_ERROR: "Không thể cập nhật sản phẩm. Vui lòng thử lại.",
  CREATE_SUCCESS: "Sản phẩm đã được tạo thành công!",
  CREATE_ERROR: "Không thể tạo sản phẩm. Vui lòng thử lại.",
  DELETE_SUCCESS: "Sản phẩm đã được xóa!",
  DELETE_ERROR: "Không thể xóa sản phẩm. Vui lòng thử lại.",
  DELETE_CONFIRM_TITLE: "Xóa sản phẩm",
  DELETE_CONFIRM_MESSAGE:
    "Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.",
  LOADING_PRODUCT: "Đang tải sản phẩm...",
  PRODUCT_NOT_FOUND: "Không tìm thấy sản phẩm",
  LOADING_ERROR: "Lỗi tải sản phẩm",
  UNSAVED: "Chưa lưu",
  SAVE_DRAFT: "Lưu nháp",
  PUBLISH_PRODUCT: "Đăng sản phẩm",
  UPDATE_PRODUCT: "Cập nhật sản phẩm",
  LOADING_UPDATE: "Đang cập nhật...",
  LOADING_CREATE: "Đang tạo...",
} as const;

// Màu sắc các section
export const PRODUCT_COLORS = {
  BACKGROUND: "#f8f6f6",
  TEXT: "text-slate-900",
  BORDER: "border-slate-200",
  BORDER_RED: "border-red-300",
  TEXT_RED: "text-red-600",
  BG_HOVER_RED: "hover:bg-red-50",
  BG_HEADER: "bg-white",
  TEXT_SLATE: "text-slate-500",
  TEXT_SLATE_DARK: "text-slate-700",
  BG_HOVER_SLATE: "hover:bg-slate-100",
} as const;

// Giá trị mặc định
export const PRODUCT_DEFAULTS = {
  PAYMENT_METHOD: "bank" as const,
  STATUS_NEW: "active",
  PRICE_DECIMAL_PLACES: 2,
} as const;

// Breadcrumb labels
export const PRODUCT_BREADCRUMBS = {
  PRODUCTS: "Sản phẩm",
  DETAIL: "Chi tiết",
  ADD: "Thêm mới",
  SLASH: "/",
} as const;

// Form labels
export const PRODUCT_FORM_LABELS = {
  BASIC_INFO: "Thông tin cơ bản",
  PRICING: "Giá bán",
  SKU: "SKU",
  GALLERY: "Thư viện ảnh",
  STATUS: "Trạng thái",
  CATEGORY: "Danh mục",
  THUMBNAIL: "Ảnh đại diện",
  DELETE: "Xóa sản phẩm",
  CANCEL: "Hủy",
  BACK: "Quay lại",
} as const;

// Price range options cho filter
export const PRODUCT_PRICE_RANGES = [
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

// Filter defaults
export const FILTER_DEFAULTS = {
  SORT_NEWEST: "newest" as const,
  STATUS_ALL: "all" as const,
  CATEGORY_ALL: "Tất cả" as const,
  SEARCH_DEFAULT: "",
  PAGE_DEFAULT: 1,
} as const;

export interface PaginationMeta {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  results?: number;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: T; // Dữ liệu chính
  meta?: PaginationMeta; // Thông tin phân trang (nếu có)
}

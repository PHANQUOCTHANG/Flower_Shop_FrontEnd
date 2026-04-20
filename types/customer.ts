export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string | null;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  totalSpent: number;
  lastOrderDate: string;
}

export interface CustomerListResponse {
  customers: Customer[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    newCustomersThisMonth?: number; // Thêm trường này để hiển thị số khách hàng mới trong tháng, nếu có dữ liệu từ backend
  };
}

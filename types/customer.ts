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
  };
}

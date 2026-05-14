export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  thumbnailUrl?: string | null;
  sortOrder: number;
  status: string;
  createdAt: string;
}

export interface CategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

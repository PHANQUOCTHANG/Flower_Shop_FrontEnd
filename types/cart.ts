export interface ProductItem {
  id: string;
  name: string;
  price: number;
  thumbnailUrl: string;
  stockQuantity: number;
}

export interface CartItemResponse {
  id: string;
  product : ProductItem ;
  quantity: number;
}

export interface CartResponse {
  id: string;
  userId: string;
  items: CartItemResponse[];
  totalItems: number; // Tổng số lượng sản phẩm (ví dụ: 5 món)
  totalUniqueItems: number; // Tổng số loại sản phẩm (ví dụ: 2 loại)
}

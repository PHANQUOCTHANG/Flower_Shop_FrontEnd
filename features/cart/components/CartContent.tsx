import { CartTable, CartItemsMobile, EmptyCart } from "./index";

import { CartItemResponse } from "@/features/cart/types/cart";

interface CartContentProps {
  items: CartItemResponse[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

// Hiển thị danh sách sản phẩm trong giỏ hàng
export function CartContent({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartContentProps) {
  if (items?.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="space-y-4">
      {/* Bảng xem cho desktop */}
      <CartTable
        items={items}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
      />

      {/* Thẻ xem cho mobile */}
      <CartItemsMobile
        items={items}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
      />
    </div>
  );
}

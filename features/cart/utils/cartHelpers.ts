// Tính tổng tiền giỏ hàng
export const calculateCartTotal = (
  items: Array<{ price: number; quantity: number }>,
) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Tính phí vận chuyển (hiện tại luôn 0)
export const calculateShippingFee = (): number => {
  return 0;
};

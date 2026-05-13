import React from "react";
import { Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { CartItemResponse } from "@/features/cart/types/cart";
import { QuantityControl } from "@/features/cart/components/QuantityControl";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface CartTableProps {
 items: CartItemResponse[];
 onUpdateQuantity: (productId: string, quantity: number) => void;
 onRemoveItem: (id: string) => void;
}

export const CartTable: React.FC<CartTableProps> = ({
 items,
 onUpdateQuantity,
 onRemoveItem,
}) => {
 return (
 <div className="hidden md:flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden mb-6">
 <div className="overflow-y-auto max-h-[800px]">
 <table className="w-full text-left border-collapse">
 <thead className="bg-white border-b border-gray-200 sticky top-0">
 <tr>
 <th className="px-6 py-4 text-sm font-bold text-gray-900 w-[40%]">Sản phẩm</th>
 <th className="px-6 py-4 text-sm font-bold text-gray-900 text-center">Đơn giá</th>
 <th className="px-6 py-4 text-sm font-bold text-gray-900 text-center">Số lượng</th>
 <th className="px-6 py-4 text-sm font-bold text-gray-900 text-center">Thành tiền</th>
 <th className="px-6 py-4" />
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100">
 {items.map((item) => (
 <tr
 key={item.id}
 className="group transition-colors"
 >
 {/* Sản phẩm */}
 <td className="px-6 py-6">
 <div className="flex items-center gap-4">
 <div className="w-[72px] h-[72px] rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shrink-0 relative">
  <OptimizedImage
  src={item.product.thumbnailUrl}
  alt={item.product.name}
  fill
  sizes="72px"
  />
 </div>
 <div>
 <p className="text-sm font-bold text-gray-900 leading-snug mb-1">
 {item.product.name}
 </p>
 </div>
 </div>
 </td>

 {/* Đơn giá */}
 <td className="px-6 py-6 text-[13px] font-bold text-gray-900 text-center whitespace-nowrap">
 {formatCurrency(item.product.price)}
 </td>

 {/* Số lượng — dùng QuantityControl thay vì gọi thẳng API */}
 <td className="px-6 py-6">
 <div className="flex items-center justify-center">
 <QuantityControl
 quantity={item.quantity}
 productId={item.product.id}
 onUpdateQuantity={onUpdateQuantity}
 variant="desktop"
 />
 </div>
 </td>

 {/* Thành tiền */}
 <td className="px-6 py-6 text-center">
 <span className="font-bold text-[#EE2B5B] text-[13px] whitespace-nowrap">
 {formatCurrency(item.product.price * item.quantity)}
 </span>
 </td>

 {/* Xóa */}
 <td className="px-6 py-6 text-right">
 <button
 onClick={() => onRemoveItem(item.product.id)}
 aria-label="Xóa sản phẩm"
 className="text-white bg-[#EE2B5B] rounded p-1.5 hover:bg-[#B3163B] transition-colors inline-flex"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 );
};


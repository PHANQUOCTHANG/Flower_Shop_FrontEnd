import React from "react";
import { Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { CartItemResponse } from "@/features/cart/types/cart";
import { QuantityControl } from "@/features/cart/components/QuantityControl";

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
 <div className="hidden md:flex flex-col rounded-2xl border border-[#e7cfd5] bg-white shadow-sm overflow-hidden">
 <div className="overflow-y-auto max-h-[800px]">
 <table className="w-full text-left border-collapse">
 <thead className="bg-[#fcf8f9] border-b border-[#e7cfd5] sticky top-0">
 <tr>
 <th className="px-6 py-4 typo-caption-xs text-[#9a4c5f] ">Sản phẩm</th>
 <th className="px-6 py-4 typo-caption-xs text-[#9a4c5f] ">Đơn giá</th>
 <th className="px-6 py-4 typo-caption-xs text-[#9a4c5f] text-center">Số lượng</th>
 <th className="px-6 py-4 typo-caption-xs text-[#9a4c5f] ">Thành tiền</th>
 <th className="px-6 py-4" />
 </tr>
 </thead>
 <tbody className="divide-y divide-[#e7cfd5] ">
 {items.map((item) => (
 <tr
 key={item.id}
 className="group hover:bg-[#ee2b5b]/[0.02] transition-colors"
 >
 {/* Sản phẩm */}
 <td className="px-6 py-6">
 <div className="flex items-center gap-4">
 <div className="relative size-20 rounded-xl overflow-hidden border border-[#e7cfd5] bg-gray-100 shrink-0">
 <img
 src={item.product.thumbnailUrl}
 alt={item.product.name}
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
 />
 </div>
 <div>
 <p className="typo-label text-[#1b0d11] leading-tight mb-1">
 {item.product.name}
 </p>
 <p className="typo-caption-xs text-[#9a4c5f] ">
 {item.product.id}
 </p>
 </div>
 </div>
 </td>

 {/* Đơn giá */}
 <td className="px-6 py-6 typo-body-sm whitespace-nowrap">
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

 {/* Thành tiền — hiển thị theo localQuantity của QuantityControl */}
 <td className="px-6 py-6">
 <span className="font-black text-[#ee2b5b] whitespace-nowrap">
 {formatCurrency(item.product.price * item.quantity)}
 </span>
 </td>

 {/* Xóa */}
 <td className="px-6 py-6 text-right">
 <button
 onClick={() => onRemoveItem(item.product.id)}
 aria-label="Xóa sản phẩm"
 className="text-[#9a4c5f] hover:text-red-500 p-2 transition-colors"
 >
 <Trash2 className="w-5 h-5" />
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


import React from "react";
import Image from "next/image";
import { OrderResponse } from "@/types/order";
import { StatusBadge } from "./StatusBadge";
import { useOrderById } from "@/features/admin/orders/hooks/useOrder";
import { Oregano } from "next/font/google";
import { formatDate } from "@/utils/format";

interface OrderDetailModalProps {
 orderId: string | null;
 onClose: () => void;
 onStatusUpdate: (orderId: string, status: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
 orderId,
 onClose,
 onStatusUpdate,
}) => {
 // Fetch chi tiết đơn hàng từ API khi có orderId
 const { order, isLoading, isFetching } = useOrderById(orderId);

 // Không render gì nếu modal chưa được mở
 if (!orderId) return null;

 return (
 <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
 <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
 {/* Header */}
 <div className="sticky top-0 bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
 <h2 className="text-lg font-black text-slate-900 ">
 Chi tiết đơn hàng
 </h2>
 {/* Hiển thị spinner nhỏ khi đang refetch (ví dụ: sau khi update status) */}
 {isFetching && !isLoading && (
 <span className="text-xs text-slate-400 animate-pulse mr-auto ml-3">
 Đang cập nhật...
 </span>
 )}
 <button
 onClick={onClose}
 className="text-slate-500 hover:text-slate-700 text-2xl"
 >
 ×
 </button>
 </div>

 {/* Loading skeleton khi fetch lần đầu */}
 {isLoading ? (
 <div className="p-6 space-y-4 animate-pulse">
 <div className="h-4 bg-slate-200 rounded w-1/3" />
 <div className="h-6 bg-slate-200 rounded w-1/2" />
 <div className="grid grid-cols-2 gap-4">
 <div className="h-10 bg-slate-200 rounded" />
 <div className="h-10 bg-slate-200 rounded" />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div className="h-10 bg-slate-200 rounded" />
 <div className="h-10 bg-slate-200 rounded" />
 </div>
 <div className="h-40 bg-slate-200 rounded" />
 </div>
 ) : !order ? (
 // Trường hợp API trả về không có data
 <div className="p-6 text-center text-slate-500 ">
 Không tìm thấy thông tin đơn hàng.
 </div>
 ) : (
 /* Content */
 <div className="p-6 space-y-6">
 {/* Order ID */}
 <div>
 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
 Mã đơn
 </p>
 <p className="text-lg font-black text-[#13ec5b]">{order.id}</p>
 </div>

 {/* Customer Info */}
 <div className="grid grid-cols-2 gap-4">
 <div>
 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
 Tên khách hàng
 </p>
 <p className="font-bold text-slate-900 ">
 {order.user?.fullName}
 </p>
 </div>
 <div>
 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
 Số điện thoại
 </p>
 <p className="font-bold text-slate-900 ">
 {order.shippingPhone}
 </p>
 </div>
 </div>

 {/* Dates and Total */}
 <div className="grid grid-cols-2 gap-4">
 <div>
 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
 Ngày đặt
 </p>
 <p className="font-bold text-slate-900 ">
 {formatDate(order.createdAt)}
 </p>
 </div>
 <div>
 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
 Tổng tiền
 </p>
 <p className="font-black text-lg text-slate-900 ">
 ₫{Math.floor(order.totalPrice).toLocaleString("vi-VN")}
 </p>
 </div>
 </div>

 {/* Payment & Status */}
 <div className="grid grid-cols-2 gap-4">
 <div>
 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
 Trạng thái thanh toán
 </p>
 <StatusBadge label={order.paymentStatus} type="payment" />
 </div>
 <div>
 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
 Trạng thái đơn hàng
 </p>
 <StatusBadge label={order.status} type="status" />
 </div>
 </div>

 {/* Products Table */}
 <div className="border-t border-slate-200 pt-6">
 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
 Thông tin sản phẩm
 </p>
 <div className="bg-slate-50 rounded-xl overflow-hidden">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-slate-100 border-b border-slate-200 ">
 <th className="px-4 py-3 text-xs font-black text-slate-600 uppercase tracking-wider">
 Ảnh
 </th>
 <th className="px-4 py-3 text-xs font-black text-slate-600 uppercase tracking-wider">
 Tên sản phẩm
 </th>
 <th className="px-4 py-3 text-xs font-black text-slate-600 uppercase tracking-wider text-center">
 Số lượng
 </th>
 <th className="px-4 py-3 text-xs font-black text-slate-600 uppercase tracking-wider text-right">
 Đơn giá
 </th>
 <th className="px-4 py-3 text-xs font-black text-slate-600 uppercase tracking-wider text-right">
 Thành tiền
 </th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200 ">
 {order.items.map((item) => (
 <tr
 key={item.id}
 className="hover:bg-slate-100 transition-colors"
 >
 <td className="px-4 py-3">
 <div className="w-12 h-12 relative">
 <Image
 src={item.thumbnail || "/placeholder.jpg"}
 alt={item.productName}
 fill
 className="object-cover rounded-lg border border-slate-200 "
 />
 </div>
 </td>
 <td className="px-4 py-3 text-sm font-bold text-slate-900 ">
 {item.productName}
 </td>
 <td className="px-4 py-3 text-sm text-slate-600 text-center">
 {item.quantity}
 </td>
 <td className="px-4 py-3 text-sm font-bold text-slate-900 text-right">
 ₫{Math.floor(item.price).toLocaleString("vi-VN")}
 </td>
 <td className="px-4 py-3 text-sm font-black text-slate-900 text-right">
 ₫
 {Math.floor(
 item.price * item.quantity,
 ).toLocaleString("vi-VN")}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 <div className="bg-slate-100 px-4 py-3 border-t border-slate-200 flex justify-end">
 <div className="text-sm">
 <span className="font-bold text-slate-600 ">
 Tổng cộng:{" "}
 </span>
 <span className="font-black text-lg text-[#13ec5b]">
 ₫{Math.floor(order.totalPrice).toLocaleString("vi-VN")}
 </span>
 </div>
 </div>
 </div>
 </div>

 {/* Action Buttons */}
 <div className="flex gap-3 pt-4 border-t border-slate-200 ">
 {order.status === "pending" && (
 <button
 onClick={() => onStatusUpdate(order.id, "processing")}
 className="flex-1 bg-[#13ec5b] text-[#102216] font-black py-2 rounded-lg hover:scale-105 transition-all"
 >
 Xác nhận giao hàng
 </button>
 )}
 {order.status === "processing" && (
 <button
 onClick={() => onStatusUpdate(order.id, "completed")}
 className="flex-1 bg-blue-500 text-white font-black py-2 rounded-lg hover:scale-105 transition-all"
 >
 Hoàn tất đơn hàng
 </button>
 )}
 <button
 onClick={onClose}
 className="flex-1 bg-slate-200 text-slate-900 font-black py-2 rounded-lg hover:scale-105 transition-all"
 >
 Đóng
 </button>
 </div>
 </div>
 )}
 </div>
 </div>
 );
};


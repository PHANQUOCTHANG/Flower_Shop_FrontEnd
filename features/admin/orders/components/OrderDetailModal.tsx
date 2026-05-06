import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { OrderResponse } from "@/types/order";
import { StatusBadge } from "./StatusBadge";
import {
  useOrderById,
  useCancelOrder,
} from "@/features/admin/orders/hooks/useOrder";
import { Oregano } from "next/font/google";
import { formatCurrency, formatDate } from "@/utils/format";
import { useAuthStore } from "@/stores/auth.store";
import { Star, X } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface OrderDetailModalProps {
  orderId: string | null;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: string) => void;
  role?: "ADMIN" | "CUSTOMER"; // Thêm prop role để điều kiện hiển thị nút
  onReviewClick?: (
    productId: string,
    productName: string,
    productImage?: string,
  ) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  orderId,
  onClose,
  onStatusUpdate,
  role = "ADMIN",
  onReviewClick,
}) => {
  const router = useRouter();
  // Fetch chi tiết đơn hàng từ API khi có orderId
  const { order, isLoading, isFetching } = useOrderById(orderId);
  const { cancelOrder, isPending: isCanceling } = useCancelOrder();
  const [showConfirm, setShowConfirm] = React.useState(false);

  // Không render gì nếu modal chưa được mở
  if (!orderId) return null;

  // Kiểm tra xem có nên hiển thị cột đánh giá không
  const showRatingColumn = order?.status === "completed" && role === "CUSTOMER";

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
            className="text-slate-500 hover:text-slate-700 p-1 hover:bg-slate-200 rounded-lg transition-colors"
            aria-label="Đóng"
          >
            <X size={24} />
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
              <p className="text-lg font-black text-primary">{order.id}</p>
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
                  <span>
                    {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="ml-2">{formatDate(order.createdAt)}</span>
                </p>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  Tổng tiền
                </p>
                <p className="font-black text-lg text-slate-900 ">
                  {formatCurrency(order.totalPrice)}
                </p>
              </div>
            </div>

            {/* Payment & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Phương thức thanh toán
                </p>
                <StatusBadge
                  label={order.paymentMethod || "cod"}
                  type="method"
                />
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
              <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
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
                      {showRatingColumn && (
                        <th className="px-4 py-3 text-xs font-black text-slate-600 uppercase tracking-wider text-center">
                          Đánh giá
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {order.items.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="w-12 h-12 relative flex-shrink-0">
                            <Image
                              src={item.thumbnail || "/placeholder.jpg"}
                              alt={item.productName}
                              fill
                              className="object-cover rounded-lg border border-slate-200"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-slate-900">
                          <span className="line-clamp-2">
                            {item.productName}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 text-center font-semibold">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-slate-900 text-right whitespace-nowrap">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-4 py-3 text-sm font-black text-slate-900 text-right whitespace-nowrap">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                        {showRatingColumn && (
                          <td className="px-4 py-3 text-center">
                            {item.isReview ? (
                              <div className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg font-bold text-xs whitespace-nowrap cursor-default">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                Đã đánh giá
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  onReviewClick?.(
                                    item.productId,
                                    item.productName,
                                    item.thumbnail || undefined,
                                  )
                                }
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 hover:border-primary/60 rounded-lg transition-all font-bold text-xs whitespace-nowrap"
                              >
                                <Star className="w-4 h-4" />
                                Đánh giá
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-slate-100 px-4 py-4 border-t border-slate-200 flex justify-end">
                  <div className="text-sm">
                    <span className="font-bold text-slate-700">Tổng cộng:</span>
                    <span className="font-black text-lg text-primary ml-2">
                      {formatCurrency(order.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-200 ">
              {order.status === "pending" && role === "ADMIN" && (
                <button
                  onClick={() => onStatusUpdate(order.id, "processing")}
                  className="flex-1 bg-primary text-[#102216] font-black py-2 rounded-lg hover:scale-105 transition-all"
                >
                  Xác nhận giao hàng
                </button>
              )}
              {order.status === "processing" && role === "ADMIN" && (
                <button
                  onClick={() => onStatusUpdate(order.id, "completed")}
                  className="flex-1 bg-blue-500 text-white font-black py-2 rounded-lg hover:scale-105 transition-all"
                >
                  Hoàn tất đơn hàng
                </button>
              )}
              {order.status === "pending" && role === "CUSTOMER" && (
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={isCanceling}
                  className="flex-1 bg-danger text-white font-black py-2 rounded-lg hover:bg-red-600 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCanceling ? "Đang hủy..." : "Hủy đơn hàng"}
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 bg-slate-200 text-slate-900 font-black py-2 rounded-lg hover:scale-105 transition-all"
              >
                Đóng
              </button>
            </div>

            {/* Modal xác nhận hủy */}
            <ConfirmDialog
              isOpen={showConfirm}
              title="Xác nhận hủy đơn"
              message="Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác."
              confirmLabel="Xác nhận hủy"
              cancelLabel="Quay lại"
              onConfirm={() => {
                cancelOrder(order.id, {
                  onSuccess: () => setShowConfirm(false),
                });
              }}
              onCancel={() => setShowConfirm(false)}
              isLoading={isCanceling}
              type="danger"
            />
          </div>
        )}
      </div>
    </div>
  );
};

"use client";

import { useState } from "react";
import { useMutation, type QueryClient } from "@tanstack/react-query";
import { checkoutService } from "@/features/checkout/services/checkoutService";
import { CreateOrderData, Order, CreateOrderResponse } from "@/types/order";
import {
  useOrderStatus,
  OrderStatusEvent,
} from "@/features/checkout/hooks/useOrderStatus";

interface UseCheckoutOptions {
  queryClient?: QueryClient; // Optional QueryClient để invalidate cache
  onSuccess?: (order: Order) => void;
  onError?: (error: any) => void;
  onStatusChange?: (event: OrderStatusEvent) => void;
  onJobIdReceived?: (jobId: string) => void; // Callback khi nhận jobId
}

export const useCheckout = (options?: UseCheckoutOptions) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  // Lắng nghe socket events khi có jobId
  const { status: socketStatus } = useOrderStatus({
    jobId: jobId || undefined,
    enabled: !!jobId,
    onStatusChange: (event) => {
      options?.onStatusChange?.(event);

      // Khi hoàn thành, gọi callback (không redirect ở đây, OrderStatusTracker sẽ xử lí)
      if (event.status === "completed" && event.data?.orderId) {
        const completedOrder: Order = {
          id: event.data.orderId,
          userId: "", // sẽ được fill từ socket event
          totalPrice: event.data.totalPrice,
          status: "processing",
          paymentStatus: "unpaid",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setOrder(completedOrder);
        options?.onSuccess?.(completedOrder);
      }

      // Khi thất bại, xử lý error
      if (event.status === "failed") {
        setErrorMessage(event.message);
        options?.onError?.(new Error(event.message));
      }
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: CreateOrderData) => {
      try {
        if (!data.shippingPhone || !data.shippingAddress) {
          throw new Error("Vui lòng điền đầy đủ thông tin giao hàng");
        }
        if (!data.items || data.items.length === 0) {
          throw new Error("Giỏ hàng trống, vui lòng thêm sản phẩm");
        }
        if (data.totalPrice <= 0) {
          throw new Error("Tổng tiền không hợp lệ");
        }
        const response = await checkoutService.createOrder(data);
        return response;
      } catch (error: any) {
        const errorMsg = error?.message || "Có lỗi xảy ra khi tạo đơn hàng";
        setErrorMessage(errorMsg);
        throw error;
      }
    },
    onSuccess: (response: CreateOrderResponse) => {
      setErrorMessage("");

      // Invalidate cache sau khi order thành công
      if (options?.queryClient) {
        options.queryClient.invalidateQueries({ queryKey: ["cart"] });
        options.queryClient.invalidateQueries({
          queryKey: ["orders", "my-orders"],
        });
      }

      if (response.data?.jobId) {
        setJobId(response.data.jobId);
        options?.onJobIdReceived?.(response.data.jobId);
      } else if (response.data?.id) {
        const completedOrder: Order = {
          id: response.data.id,
          userId: "",
          totalPrice: 0,
          status: response.data.status || "processing",
          paymentStatus: "unpaid",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setOrder(completedOrder);
        options?.onSuccess?.(completedOrder);
      }
    },
    onError: (error: any) => {
      const errorMsg = error?.message || "Có lỗi xảy ra khi tạo đơn hàng";
      setErrorMessage(errorMsg);
      options?.onError?.(error);
    },
  });

  const handleCreateOrder = async (data: CreateOrderData) => {
    return createOrderMutation.mutateAsync(data);
  };

  const resetState = () => {
    setJobId(null);
    setOrder(null);
    setErrorMessage("");
  };

  return {
    createOrder: handleCreateOrder,
    isLoading: createOrderMutation.isPending,
    error: errorMessage,
    isSuccess: createOrderMutation.isSuccess,
    order: order || createOrderMutation.data,
    jobId,
    socketStatus,
    resetState,
  };
};

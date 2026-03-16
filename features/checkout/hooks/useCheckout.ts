"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  checkoutService,
  CreateOrderData,
  Order,
} from "@/features/checkout/services/checkoutService";

interface UseCheckoutOptions {
  onSuccess?: (order: Order) => void;
  onError?: (error: any) => void;
}

export const useCheckout = (options?: UseCheckoutOptions) => {
  const [errorMessage, setErrorMessage] = useState("");

  const createOrderMutation = useMutation({
    mutationFn: async (data: CreateOrderData) => {
      try {
        // Validate dữ liệu
        if (!data.shippingPhone || !data.shippingAddress) {
          throw new Error("Vui lòng điền đầy đủ thông tin giao hàng");
        }

        if (!data.items || data.items.length === 0) {
          throw new Error("Giỏ hàng trống, vui lòng thêm sản phẩm");
        }

        if (data.totalPrice <= 0) {
          throw new Error("Tổng tiền không hợp lệ");
        }

        // Gọi API tạo đơn hàng
        const order = await checkoutService.createOrder(data);
        return order;
      } catch (error: any) {
        const errorMsg = error?.message || "Có lỗi xảy ra khi tạo đơn hàng";
        setErrorMessage(errorMsg);
        throw error;
      }
    },
    onSuccess: (order) => {
      setErrorMessage("");
      options?.onSuccess?.(order);
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

  return {
    createOrder: handleCreateOrder,
    isLoading: createOrderMutation.isPending,
    error: errorMessage,
    isSuccess: createOrderMutation.isSuccess,
    order: createOrderMutation.data,
  };
};

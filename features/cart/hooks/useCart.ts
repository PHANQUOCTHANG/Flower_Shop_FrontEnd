/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/features/cart/services/cartService";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";

// Key dùng cho React Query cache
const CART_QUERY_KEY = ["cart"];

// Hook lấy giỏ hàng từ server
export const useFetchCart = (enabled = true) => {
  const { setItems, setLoading, setError } = useCartStore();

  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await cartService.fetchCart();
        setItems(data.data.items);
        setError(null);
        return data;
      } catch (error: any) {
        const errorMsg = error?.message || "Lỗi khi lấy giỏ hàng";
        setError(errorMsg);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled,
  });
};

// Hook thêm sản phẩm vào giỏ hàng
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { setError } = useCartStore();

  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      await cartService.addItem(productId, quantity);
    },
    onSuccess: () => {
      // Reload giỏ hàng từ server ngay lập tức
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      setError(null);
    },
    onError: (error: any) => {
      const errorMsg = error?.message || "Lỗi khi thêm sản phẩm vào giỏ";
      setError(errorMsg);
      // Đồng bộ với server
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};

// Hook xóa sản phẩm khỏi giỏ hàng
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const { removeItem, setError } = useCartStore();

  return useMutation({
    mutationFn: async (productId: string) => {
      await cartService.removeItem(productId);
    },
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });

      // Cập nhật UI ngay (optimistic update)
      removeItem(productId);
      setError(null);
    },
    onSuccess: () => {
      // Reload giỏ hàng từ server ngay lập tức
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: (error: any) => {
      const errorMsg = error?.message || "Lỗi khi xóa sản phẩm";
      setError(errorMsg);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};

// Hook cập nhật số lượng sản phẩm trong giỏ
export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();
  const { updateQuantity, setError } = useCartStore();

  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      await cartService.updateQuantity(productId, quantity);
    },
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });

      // Cập nhật UI ngay (optimistic update)
      updateQuantity(productId, quantity);
      setError(null);
    },
    onSuccess: () => {
      // Reload giỏ hàng từ server ngay lập tức
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: (error: any) => {
      const errorMsg = error?.message || "Lỗi khi cập nhật số lượng";
      setError(errorMsg);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};

// Hook xóa toàn bộ giỏ hàng
export const useClearCart = () => {
  const queryClient = useQueryClient();
  const { clearCart, setError } = useCartStore();

  return useMutation({
    mutationFn: async () => {
      await cartService.clearCart();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });

      // Cập nhật UI ngay (optimistic update)
      clearCart();
      setError(null);
    },
    onSuccess: (data) => {
      // useCartStore.getState().setItems(data.items);
      queryClient.setQueryData(CART_QUERY_KEY, data);
    },
    onError: (error: any) => {
      const errorMsg = error?.message || "Lỗi khi xóa giỏ hàng";
      setError(errorMsg);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};

// Hook lấy trạng thái giỏ hàng từ store
// Nếu đã đăng nhập thì auto fetch cart để sync store
export const useCart = () => {
  const items = useCartStore((state) => state.items);
  const isLoading = useCartStore((state) => state.isLoading);
  const error = useCartStore((state) => state.error);
  const total = useCartStore((state) => state.getTotal());
  const itemCount = useCartStore((state) => state.getItemCount());

  return {
    items,
    total,
    itemCount,
    isLoading,
    error,
  };
};

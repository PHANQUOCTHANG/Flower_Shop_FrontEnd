"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/features/cart/services/cartService";
import { useCartStore } from "@/stores/cart.store";
import { CartItemResponse } from "@/types/cart";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CartQueryData {
  data: {
    items: CartItemResponse[];
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const CART_QUERY_KEY = ["cart"] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Cập nhật quantity của một item trong React Query cache (không trigger refetch).
 */
const patchQuantityInCache = (
  old: CartQueryData | undefined,
  productId: string,
  quantity: number,
): CartQueryData | undefined => {
  if (!old?.data?.items) return old;
  return {
    ...old,
    data: {
      ...old.data,
      items: old.data.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    },
  };
};

// ─── Hook: Fetch cart ─────────────────────────────────────────────────────────

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
      } catch (error: unknown) {
        const errorMsg =
          error instanceof Error ? error.message : "Lỗi khi lấy giỏ hàng";
        setError(errorMsg);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled,
    // Không tự refetch khi focus lại tab — tránh reset UI đột ngột
    refetchOnWindowFocus: false,
  });
};

// ─── Hook: Add to cart ────────────────────────────────────────────────────────

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { setError } = useCartStore();

  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => cartService.addItem(productId, quantity),
    onSuccess: async () => {
      // Refetch cart ngay để update header + cart page
      await queryClient.refetchQueries({ queryKey: CART_QUERY_KEY });
      setError(null);
    },
    onError: (error: unknown) => {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Lỗi khi thêm sản phẩm vào giỏ";
      setError(errorMsg);
    },
  });
};

// ─── Hook: Remove from cart ───────────────────────────────────────────────────

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const { removeItem, setError, setItems } = useCartStore();

  return useMutation({
    mutationFn: (productId: string) => cartService.removeItem(productId),

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });

      // Snapshot để rollback nếu lỗi
      const previousData =
        queryClient.getQueryData<CartQueryData>(CART_QUERY_KEY);

      // Optimistic: xóa khỏi React Query cache
      queryClient.setQueryData<CartQueryData>(CART_QUERY_KEY, (old) => {
        if (!old?.data?.items) return old;
        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.filter(
              (item) => item.product.id !== productId,
            ),
          },
        };
      });

      // Optimistic: xóa khỏi Zustand store
      removeItem(productId);
      setError(null);

      return { previousData };
    },

    onError: (error: unknown, _productId, context) => {
      // Rollback React Query cache
      if (context?.previousData) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousData);
        // Rollback Zustand store
        setItems(context.previousData.data.items);
      }
      const errorMsg =
        error instanceof Error ? error.message : "Lỗi khi xóa sản phẩm";
      setError(errorMsg);
    },

    // Không gọi invalidateQueries ở onSuccess:
    // Optimistic update đã đúng, không cần refetch gây lag.
    // Chỉ sync lại nếu server trả data mới (xử lý ở onSettled nếu cần).
  });
};

// ─── Hook: Update quantity ────────────────────────────────────────────────────

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();
  const { updateQuantity, setError, setItems } = useCartStore();

  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => cartService.updateQuantity(productId, quantity),

    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });

      // Snapshot để rollback nếu API lỗi
      const previousData =
        queryClient.getQueryData<CartQueryData>(CART_QUERY_KEY);

      // [OPTIMISTIC] Cập nhật React Query cache — không trigger refetch
      queryClient.setQueryData<CartQueryData>(CART_QUERY_KEY, (old) =>
        patchQuantityInCache(old, productId, quantity),
      );

      // [OPTIMISTIC] Cập nhật Zustand store — UI re-render ngay lập tức
      updateQuantity(productId, quantity);
      setError(null);

      return { previousData };
    },

    onError: (error: unknown, _variables, context) => {
      // [ROLLBACK] Khôi phục cả React Query cache lẫn Zustand store
      if (context?.previousData) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousData);
        setItems(context.previousData.data.items);
      }
      const errorMsg =
        error instanceof Error ? error.message : "Lỗi khi cập nhật số lượng";
      setError(errorMsg);
    },

    // FIX: Bỏ invalidateQueries ở onSuccess.
    // Đây là nguyên nhân gây lag: onSuccess → refetch → setItems → re-render.
    // Optimistic update đã xử lý đúng UI, server confirm là đủ.
  });
};

// ─── Hook: Clear cart ─────────────────────────────────────────────────────────

export const useClearCart = () => {
  const queryClient = useQueryClient();
  const { clearCart, setError, setItems } = useCartStore();

  return useMutation({
    mutationFn: () => cartService.clearCart(),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousData =
        queryClient.getQueryData<CartQueryData>(CART_QUERY_KEY);

      queryClient.setQueryData<CartQueryData>(CART_QUERY_KEY, (old) => {
        if (!old) return old;
        return { ...old, data: { ...old.data, items: [] } };
      });

      clearCart();
      setError(null);

      return { previousData };
    },

    onError: (error: unknown, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousData);
        setItems(context.previousData.data.items);
      }
      const errorMsg =
        error instanceof Error ? error.message : "Lỗi khi xóa giỏ hàng";
      setError(errorMsg);
    },
  });
};

// ─── Hook: Read cart state ────────────────────────────────────────────────────

export const useCart = () => {
  const items = useCartStore((state) => state.items);
  const isLoading = useCartStore((state) => state.isLoading);
  const error = useCartStore((state) => state.error);
  const total = useCartStore((state) => state.getTotal());
  const itemCount = useCartStore((state) => state.getItemCount());

  return { items, total, itemCount, isLoading, error };
};

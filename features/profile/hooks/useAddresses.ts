// Hook quản lý danh sách địa chỉ của người dùng
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Address, CreateAddressRequest } from "@/types/profile";
import * as addressService from "../services/addressService";

export const useAddresses = () => {
  // State: Danh sách địa chỉ (quản lý cục bộ)
  const [addresses, setAddresses] = useState<Address[]>([]);
  // State: Lỗi từ API
  const [error, setError] = useState<string | null>(null);
  // Hook: React Query client để invalidate cache
  const queryClient = useQueryClient();

  // Query: Fetch danh sách địa chỉ từ API
  const {
    data: fetchedAddresses = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      try {
        const data = await addressService.fetchAddresses();
        return data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Lỗi không xác định";
        setError(message);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 phút
  });

  // Effect: Sync dữ liệu từ React Query vào state
  useEffect(() => {
    if (fetchedAddresses.length > 0) {
      setAddresses(fetchedAddresses);
    }
  }, [fetchedAddresses]);

  // Mutation: Tạo mới địa chỉ
  const createMutation = useMutation({
    mutationFn: (payload: CreateAddressRequest) =>
      addressService.createAddress(payload),
    onSuccess: (newAddress) => {
      setAddresses((prev) => [...prev, newAddress]);
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setError(null);
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Lỗi tạo địa chỉ";
      setError(message);
    },
  });

  // Mutation: Cập nhật địa chỉ
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CreateAddressRequest;
    }) => addressService.updateAddress(id, payload),
    onSuccess: (updatedAddress) => {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === updatedAddress.id ? updatedAddress : addr,
        ),
      );
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setError(null);
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Lỗi cập nhật địa chỉ";
      setError(message);
    },
  });

  // Mutation: Xóa địa chỉ
  const deleteMutation = useMutation({
    mutationFn: (id: string) => addressService.deleteAddress(id),
    onSuccess: (_, id) => {
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setError(null);
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Lỗi xóa địa chỉ";
      setError(message);
    },
  });

  // Mutation: Đặt địa chỉ mặc định
  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => addressService.setDefaultAddress(id),
    onSuccess: (updatedAddress) => {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === updatedAddress.id
            ? { ...addr, isDefault: true }
            : { ...addr, isDefault: false },
        ),
      );
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setError(null);
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Lỗi đặt địa chỉ mặc định";
      setError(message);
    },
  });

  return {
    addresses,
    isLoading,
    error,
    refetch,
    createMutation,
    updateMutation,
    deleteMutation,
    setDefaultMutation,
  };
};

// Hook quản lý danh sách địa chỉ của người dùng
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Address, CreateAddressRequest } from "@/types/profile";
import * as addressService from "../services/addressService";

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface AddressesResult {
  data: Address[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  results?: number;
}

export const useAddresses = ({
  page = 1,
  limit = 6,
}: PaginationParams = {}) => {
  // State: Danh sách địa chỉ (quản lý cục bộ)
  const [addresses, setAddresses] = useState<Address[]>([]);
  // State: Metadata phân trang
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 0,
  });
  // State: Lỗi từ API
  const [error, setError] = useState<string | null>(null);
  // Hook: React Query client để invalidate cache
  const queryClient = useQueryClient();

  // Query: Fetch danh sách địa chỉ từ API
  const {
    data: result,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["addresses", { page, limit }],
    queryFn: async () => {
      try {
        const data = await addressService.fetchAddresses(page, limit);
        console.log("Fetched addresses data:", data); // Debug log
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
    if (result?.data) {
      setAddresses(result.data);
      setMeta({
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    }
  }, [result]);

  // Mutation: Tạo mới địa chỉ
  const createMutation = useMutation({
    mutationFn: (payload: CreateAddressRequest) =>
      addressService.createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses", { page, limit }],
      });
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses", { page, limit }],
      });
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses", { page, limit }],
      });
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses", { page, limit }],
      });
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
    meta,
    isLoading,
    error,
    refetch,
    createMutation,
    updateMutation,
    deleteMutation,
    setDefaultMutation,
  };
};

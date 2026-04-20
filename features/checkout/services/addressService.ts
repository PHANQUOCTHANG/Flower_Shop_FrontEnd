import axios from "@/lib/axios";
import type { Address } from "@/types/profile";
import type { ApiResponse } from "@/types/response";

const ADDRESSES_API = "/addresses";

// Service quản lý địa chỉ giao hàng - gọi API
export const addressService = {
  // Lấy danh sách tất cả địa chỉ
  fetchAddresses: async (): Promise<Address[]> => {
    try {
      const response = await axios.get<ApiResponse<Address[]>>(ADDRESSES_API);
      console.log("[addressService.fetchAddresses] ✓ Success", response.data);
      return response.data.data || [];
    } catch (error) {
      console.error("[addressService.fetchAddresses] ✗ Error:", error);
      throw error;
    }
  },

  // Lấy chi tiết một địa chỉ
  fetchAddressById: async (id: string): Promise<Address> => {
    try {
      const response = await axios.get<ApiResponse<Address>>(
        `${ADDRESSES_API}/${id}`,
      );
      console.log("[addressService.fetchAddressById] ✓ Success", response.data);
      return response.data.data;
    } catch (error) {
      console.error("[addressService.fetchAddressById] ✗ Error:", error);
      throw error;
    }
  },

  // Tạo địa chỉ mới
  createAddress: async (data: Partial<Address>): Promise<Address> => {
    try {
      const response = await axios.post<ApiResponse<Address>>(
        ADDRESSES_API,
        data,
      );
      console.log("[addressService.createAddress] ✓ Success", response.data);
      return response.data.data;
    } catch (error) {
      console.error("[addressService.createAddress] ✗ Error:", error);
      throw error;
    }
  },

  // Cập nhật địa chỉ
  updateAddress: async (
    id: string,
    data: Partial<Address>,
  ): Promise<Address> => {
    try {
      const response = await axios.patch<ApiResponse<Address>>(
        `${ADDRESSES_API}/${id}`,
        data,
      );
      console.log("[addressService.updateAddress] ✓ Success", response.data);
      return response.data.data;
    } catch (error) {
      console.error("[addressService.updateAddress] ✗ Error:", error);
      throw error;
    }
  },

  // Xóa địa chỉ
  deleteAddress: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${ADDRESSES_API}/${id}`);
      console.log("[addressService.deleteAddress] ✓ Success");
    } catch (error) {
      console.error("[addressService.deleteAddress] ✗ Error:", error);
      throw error;
    }
  },

  // Đặt địa chỉ làm mặc định
  setDefaultAddress: async (id: string): Promise<Address> => {
    try {
      const response = await axios.patch<ApiResponse<Address>>(
        `${ADDRESSES_API}/${id}/set-default`,
      );
      console.log(
        "[addressService.setDefaultAddress] ✓ Success",
        response.data,
      );
      return response.data.data;
    } catch (error) {
      console.error("[addressService.setDefaultAddress] ✗ Error:", error);
      throw error;
    }
  },
};

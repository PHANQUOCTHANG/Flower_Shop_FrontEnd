import axiosInstance from "@/lib/axios";
import type {
  Address,
  AddressesResponse,
  CreateAddressRequest,
  UpdateAddressRequest,
} from "@/types/profile";

const API_BASE = "/addresses";

// Lấy danh sách tất cả địa chỉ của người dùng
export const fetchAddresses = async (): Promise<Address[]> => {
  const response = await axiosInstance.get<AddressesResponse>(API_BASE);
  return response.data.data || [];
};

// Lấy thông tin chi tiết một địa chỉ
export const fetchAddressById = async (id: string): Promise<Address> => {
  const response = await axiosInstance.get<{ data: Address }>(
    `${API_BASE}/${id}`,
  );
  return response.data.data;
};

// Tạo mới một địa chỉ
export const createAddress = async (
  payload: CreateAddressRequest,
): Promise<Address> => {
  const response = await axiosInstance.post<{ data: Address }>(
    API_BASE,
    payload,
  );
  return response.data.data;
};

// Cập nhật địa chỉ
export const updateAddress = async (
  id: string,
  payload: CreateAddressRequest,
): Promise<Address> => {
  const response = await axiosInstance.patch<{ data: Address }>(
    `${API_BASE}/${id}`,
    payload,
  );
  return response.data.data;
};

// Xóa địa chỉ
export const deleteAddress = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${API_BASE}/${id}`);
};

// Đặt địa chỉ mặc định
export const setDefaultAddress = async (id: string): Promise<Address> => {
  const response = await axiosInstance.patch<{ data: Address }>(
    `${API_BASE}/${id}/set-default`,
  );
  return response.data.data;
};

// Hook fetch danh sách addresses cho checkout
import { useQuery } from "@tanstack/react-query";
import type { Address } from "@/types/profile";
import { addressService } from "../services/addressService";

// Hook query danh sách addresses
export const useAddressesForCheckout = () => {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressService.fetchAddresses(),
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 60 * 60 * 1000, // 1 giờ
  });
};

// Hook lấy địa chỉ mặc định
export const useDefaultAddress = () => {
  const { data: addresses = [] } = useAddressesForCheckout();
  return addresses.find((addr) => addr.isDefault) || null;
};

// Utility format full address string
export const formatFullAddress = (address: Address): string => {
  return `${address.streetDetail}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`;
};

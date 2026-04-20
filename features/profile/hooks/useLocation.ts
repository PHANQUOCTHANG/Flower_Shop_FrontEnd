import { useQuery } from "@tanstack/react-query";
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
  type Province,
  type District,
  type Ward,
} from "../services/locationService";

// Hook fetch tỉnh/thành phố - cache 1 giờ
export const useProvinces = () => {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: fetchProvinces,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
};

// Hook fetch quận/huyện theo tỉnh - chỉ chạy khi có provinceId
export const useDistricts = (provinceId?: string) => {
  return useQuery({
    queryKey: ["districts", provinceId],
    queryFn: () => {
      if (!provinceId) return Promise.resolve([]);
      return fetchDistricts(provinceId);
    },
    enabled: !!provinceId,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
};

// Hook fetch phường/xã theo quận - chỉ chạy khi có districtId
export const useWards = (districtId?: string) => {
  return useQuery({
    queryKey: ["wards", districtId],
    queryFn: () => {
      if (!districtId) return Promise.resolve([]);
      return fetchWards(districtId);
    },
    enabled: !!districtId,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
};

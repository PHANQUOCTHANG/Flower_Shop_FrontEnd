// Service để fetch dữ liệu địa chỉ hành chính
// Sử dụng API công khai provinces.open-api.vn

export interface Province {
  id: string;
  name: string;
  code: string;
}

export interface District {
  id: string;
  name: string;
  code: string;
  provinceId: string;
}

export interface Ward {
  id: string;
  name: string;
  code: string;
  districtId: string;
}

// Fetch danh sách tỉnh/thành phố từ API công khai
export const fetchProvinces = async (): Promise<Province[]> => {
  try {
    const response = await fetch("https://provinces.open-api.vn/api/?depth=1");
    if (!response.ok) throw new Error("Failed to fetch provinces");

    const data = (await response.json()) as Array<{
      code: number;
      name: string;
    }>;
    return data.map((item) => ({
      id: item.code.toString(),
      name: item.name,
      code: item.code.toString(),
    }));
  } catch (error) {
    return [];
  }
};

// Fetch danh sách quận/huyện theo tỉnh
export const fetchDistricts = async (
  provinceId: string,
): Promise<District[]> => {
  try {
    const response = await fetch(
      `https://provinces.open-api.vn/api/p/${provinceId}?depth=2`,
    );
    if (!response.ok) throw new Error("Failed to fetch districts");

    const data = (await response.json()) as {
      districts?: Array<{ code: number; name: string; province_code?: number }>;
    };
    return (data.districts || []).map((item) => ({
      id: item.code.toString(),
      name: item.name,
      code: item.code.toString(),
      provinceId: item.province_code?.toString() || provinceId,
    }));
  } catch (error) {
    return [];
  }
};

// Fetch danh sách phường/xã theo quận
export const fetchWards = async (districtId: string): Promise<Ward[]> => {
  try {
    const response = await fetch(
      `https://provinces.open-api.vn/api/d/${districtId}?depth=2`,
    );
    if (!response.ok) throw new Error("Failed to fetch wards");

    const data = (await response.json()) as {
      wards?: Array<{ code: number; name: string; district_code?: number }>;
    };
    return (data.wards || []).map((item) => ({
      id: item.code.toString(),
      name: item.name,
      code: item.code.toString(),
      districtId: item.district_code?.toString() || districtId,
    }));
  } catch (error) {
    return [];
  }
};

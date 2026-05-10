  import { useState, useMemo, useCallback } from "react";
import { useCustomers } from "@/features/admin/customers/hooks/useCustomers";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

// Xác định hạng thẻ dựa trên tổng chi tiêu
export const getTierFromSpent = (totalSpent: number): string => {
  if (totalSpent >= 20000000) return "VIP";
  if (totalSpent >= 10000000) return "Vàng";
  if (totalSpent >= 5000000) return "Bạc";
  return "Đồng";
};

export function useCustomersPageLogic() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [appliedSearchKeyword, setAppliedSearchKeyword] = useState("");
  const [selectedTier, setSelectedTier] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounced Search Apply
  const debouncedSearchApply = useDebouncedCallback((keyword: string) => {
    setAppliedSearchKeyword(keyword);
    setCurrentPage(1);
  }, 500);

  // Xử lý thay đổi search keyword
  const handleSearchChange = useCallback(
    (val: string) => {
      setSearchKeyword(val);
      debouncedSearchApply(val);
    },
    [debouncedSearchApply]
  );

  // Lấy dữ liệu khách hàng từ hook
  const { customers, meta, loading, error } = useCustomers({
    page: currentPage,
    limit: 10,
    search: appliedSearchKeyword || undefined,
    tier: selectedTier !== "Tất cả" ? selectedTier : undefined,
  });

  // Lấy dữ liệu trực tiếp từ backend thay vì filter mảng 10 phần tử
  const filteredCustomers = customers;

  // Lấy thống kê từ API (backend sẽ tính toán trên toàn bộ database)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metaStats = meta as any;
  const totalVIP = metaStats?.totalVIP ?? 0;
  const totalGold = metaStats?.totalGold ?? 0;
  const totalSilver = metaStats?.totalSilver ?? 0;
  const totalBronze = metaStats?.totalBronze ?? 0;

  const activeCustomers = metaStats?.activeCustomers ?? 0;
  const totalCustomersInDb = metaStats?.totalElements ?? customers.length;
  const newCustomersThisMonth = metaStats?.newCustomersThisMonth ?? 0;

  return {
    state: {
      searchKeyword,
      selectedTier,
      currentPage,
      filteredCustomers,
      newCustomersThisMonth,
      totalVIP,
      totalGold,
      totalSilver,
      totalBronze,
      activeCustomers,
      totalCustomersInPage: totalCustomersInDb, // Hiển thị tổng database thay vì chỉ 10 khách
      totalPages: metaStats?.totalPages ?? Math.ceil(customers.length / 10),
      loading,
      error,
    },
    actions: {
      handleSearchChange,
      setSelectedTier,
      setCurrentPage,
    },
  };
}

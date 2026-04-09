"use client";

import React, { useState, useMemo } from "react";
import { Users, Star } from "lucide-react";
import { useCustomers } from "@/features/admin/customers/hooks/useCustomers";
import {
  CustomersHeader,
  CustomersFilter,
  CustomersSearch,
  CustomersTable,
  StatCard,
} from "@/features/admin/customers/components";

// Xác định hạng thẻ dựa trên tổng chi tiêu
const getTierFromSpent = (totalSpent: number): string => {
  if (totalSpent >= 20000000) return "VIP";
  if (totalSpent >= 10000000) return "Vàng";
  if (totalSpent >= 5000000) return "Bạc";
  return "Đồng";
};

export default function CustomersPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTier, setSelectedTier] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);

  // Lấy dữ liệu khách hàng từ hook
  const { customers, loading, error } = useCustomers({
    page: currentPage,
    limit: 10,
    search: searchKeyword || undefined,
  });

  // Lọc khách hàng theo hạng
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const tier = getTierFromSpent(customer.totalSpent);
      const matchTier = selectedTier === "Tất cả" || tier === selectedTier;
      return matchTier;
    });
  }, [customers, selectedTier]);

  // Tính toán thống kê
  const totalVIP = customers.filter(
    (c) => getTierFromSpent(c.totalSpent) === "VIP",
  ).length;
  const activeCustomers = customers.filter((c) => c.isActive).length;

  return (
    <div className="flex flex-col min-h-screen overflow-auto bg-[#f6f8f6] font-['Inter',_sans-serif] text-slate-900">
      {/* Header */}
      <CustomersHeader />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-6 sm:gap-8 animate-in fade-in duration-500">
          {/* Thẻ thống kê */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              icon={Users}
              iconBgColor="bg-[#13ec5b]/10"
              iconColor="text-[#13ec5b]"
              label="Tổng khách hàng"
              value={customers.length}
            />
            <StatCard
              icon={Users}
              iconBgColor="bg-blue-500/10"
              iconColor="text-blue-500"
              label="Khách hàng mới"
              value="+42"
            />
            <StatCard
              icon={Star}
              iconBgColor="bg-purple-500/10"
              iconColor="text-purple-500"
              label="Thành viên VIP"
              value={totalVIP}
            />
            <StatCard
              icon={Users}
              iconBgColor="bg-[#13ec5b]/10"
              iconColor="text-[#13ec5b]"
              label="Đang hoạt động"
              value={activeCustomers}
            />
          </div>

          {/* Bộ lọc */}
          <CustomersFilter
            selectedTier={selectedTier}
            onTierChange={setSelectedTier}
          />

          {/* Thanh tìm kiếm */}
          <CustomersSearch
            searchKeyword={searchKeyword}
            onSearchChange={setSearchKeyword}
          />

          {/* Bảng khách hàng */}
          <CustomersTable
            customers={filteredCustomers}
            loading={loading}
            error={error}
            currentPage={currentPage}
            totalPages={Math.ceil(customers.length / 10)}
            totalItems={customers.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </div>
  );
}

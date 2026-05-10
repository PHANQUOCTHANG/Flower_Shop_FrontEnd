"use client";

import React, { Suspense } from "react";
import { Users, Star } from "lucide-react";
import { Loading } from "@/components/ui/Loading";
import {
  CustomersHeader,
  CustomerFilters,
  CustomersTable,
  StatCard,
} from "@/features/admin/customers/components";
import { useCustomersPageLogic } from "@/features/admin/customers/hooks/useCustomersPageLogic";

function CustomersPageContent() {
  const { state, actions } = useCustomersPageLogic();

  return (
    <div className="flex flex-col min-h-screen overflow-auto bg-[#f6f8f6] font-['Inter',_sans-serif] text-slate-900">
      {/* Header */}
      <CustomersHeader />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-6 sm:gap-8 animate-in fade-in duration-500">
          {/* Thẻ thống kê chung */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              icon={Users}
              iconBgColor="bg-[#13ec5b]/10"
              iconColor="text-[#13ec5b]"
              label="Tổng khách hàng"
              value={state.totalCustomersInPage}
            />
            <StatCard
              icon={Users}
              iconBgColor="bg-blue-500/10"
              iconColor="text-blue-500"
              label="Khách hàng mới"
              value={`+${state.newCustomersThisMonth}`}
            />
            <StatCard
              icon={Users}
              iconBgColor="bg-emerald-500/10"
              iconColor="text-emerald-500"
              label="Đang hoạt động"
              value={state.activeCustomers}
            />
          </div>

          {/* Thống kê theo Hạng Thẻ */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              icon={Star}
              iconBgColor="bg-purple-500/10"
              iconColor="text-purple-500"
              label="Thành viên VIP"
              value={state.totalVIP}
            />
            <StatCard
              icon={Star}
              iconBgColor="bg-amber-500/10"
              iconColor="text-amber-500"
              label="Thành viên Vàng"
              value={state.totalGold}
            />
            <StatCard
              icon={Star}
              iconBgColor="bg-slate-400/10"
              iconColor="text-slate-500"
              label="Thành viên Bạc"
              value={state.totalSilver}
            />
            <StatCard
              icon={Star}
              iconBgColor="bg-orange-600/10"
              iconColor="text-orange-600"
              label="Thành viên Đồng"
              value={state.totalBronze}
            />
          </div>

          {/* Bộ lọc và Tìm kiếm */}
          <CustomerFilters
            searchKeyword={state.searchKeyword}
            selectedTier={state.selectedTier}
            onSearchChange={actions.handleSearchChange}
            onTierChange={actions.setSelectedTier}
          />

          {/* Bảng khách hàng */}
          <CustomersTable
            customers={state.filteredCustomers}
            loading={state.loading}
            error={state.error}
            currentPage={state.currentPage}
            totalPages={state.totalPages}
            totalItems={state.totalCustomersInPage}
            onPageChange={actions.setCurrentPage}
          />
        </div>
      </main>
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CustomersPageContent />
    </Suspense>
  );
}

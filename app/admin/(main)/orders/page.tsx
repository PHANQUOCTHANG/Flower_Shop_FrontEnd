/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loading } from "@/components/ui/Loading";
import {
  useOrders,
  useUpdateOrderStatus,
} from "@/features/admin/orders/hooks/useOrder";
import type { GetOrdersParams } from "@/features/admin/orders/services/orderService";
import { OrderResponse } from "@/features/admin/orders/types/order";
import {
  OrdersHeader,
  OrderStatusTabs,
  OrderFilters,
  OrdersTable,
  OrderStatistics,
  OrderDetailModal,
} from "@/features/admin/orders/components";

function OrdersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Unified filter state
  const [filters, setFilters] = useState({
    search: "",
    status: undefined as string | undefined,
    dateFrom: "",
    dateTo: "",
    paymentStatus: "all",
    sort: "newest",
  });

  // Applied filters (for API fetch)
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Fetch orders
  const {
    orders,
    meta,
    pagination,
    loading: ordersLoading,
    fetching,
    refetch,
  } = useOrders({
    page: currentPage,
    limit: 10,
    search: appliedFilters.search || undefined,
    status:
      appliedFilters.status === "all"
        ? undefined
        : (appliedFilters.status as GetOrdersParams["status"]),
    paymentStatus:
      appliedFilters.paymentStatus === "all"
        ? undefined
        : (appliedFilters.paymentStatus as GetOrdersParams["paymentStatus"]),
    dateFrom: appliedFilters.dateFrom || undefined,
    dateTo: appliedFilters.dateTo || undefined,
    sort: appliedFilters.sort as GetOrdersParams["sort"],
  });

  const { updateStatus } = useUpdateOrderStatus();

  // Initialize from URL
  useEffect(() => {
    const newFilters = {
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || undefined,
      dateFrom: searchParams.get("dateFrom") || "",
      dateTo: searchParams.get("dateTo") || "",
      paymentStatus: searchParams.get("paymentStatus") || "all",
      sort: searchParams.get("sort") || "newest",
    };
    const page = parseInt(searchParams.get("page") || "1");

    setFilters(newFilters);
    setAppliedFilters(newFilters);
    setCurrentPage(page);
  }, [searchParams]);

  // Unified Query Param Update
  const updateUrl = (newFilters: typeof filters, page: number) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.status && newFilters.status !== "all")
      params.set("status", newFilters.status);
    if (newFilters.dateFrom) params.set("dateFrom", newFilters.dateFrom);
    if (newFilters.dateTo) params.set("dateTo", newFilters.dateTo);
    if (newFilters.paymentStatus !== "all")
      params.set("paymentStatus", newFilters.paymentStatus);
    if (newFilters.sort !== "newest") params.set("sort", newFilters.sort);
    if (page > 1) params.set("page", page.toString());

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "/admin/orders");
  };

  const handleStatusChange = (newStatus: string) => {
    const status = newStatus === "Tất cả" ? "all" : newStatus.toLowerCase();
    const nextFilters = { ...filters, status };
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setCurrentPage(1);
    updateUrl(nextFilters, 1);
  };

  const handleApplyFilter = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
    updateUrl(filters, 1);
  };

  const handleClearFilter = () => {
    const resetFilters = {
      search: "",
      status: undefined,
      dateFrom: "",
      dateTo: "",
      paymentStatus: "all",
      sort: "newest",
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setCurrentPage(1);
    router.push("/admin/orders");
  };

  // Debounce search onChange
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const nextFilters = { ...filters, search: val };
    setFilters(nextFilters);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setAppliedFilters(nextFilters);
      setCurrentPage(1);
      updateUrl(nextFilters, 1);
    }, 500);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleStatusUpdate = (orderId: string, status: string) => {
    updateStatus(
      { orderId, status: status as any },
      { onSuccess: () => refetch() },
    );
  };

  const tabs = useMemo(() => {
    const counts = meta?.statusCounts || {
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
    };
    const total =
      counts.pending + counts.processing + counts.completed + counts.cancelled;

    return [
      { name: "Tất cả", value: "all", count: total },
      { name: "Chờ xử lý", value: "pending", count: counts.pending },
      { name: "Đang giao", value: "processing", count: counts.processing },
      { name: "Đã giao", value: "completed", count: counts.completed },
      { name: "Đã hủy", value: "cancelled", count: counts.cancelled },
    ];
  }, [meta?.statusCounts]);

  if (ordersLoading) return <Loading />;

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f8f6] font-['Inter',_sans-serif] overflow-auto">
      <OrdersHeader />

      <main className="p-4 sm:p-6 md:p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-6 sm:gap-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100">
            <OrderStatusTabs
              tabs={tabs}
              selectedStatus={filters.status}
              onStatusChange={handleStatusChange}
            />
          </div>

          <OrderFilters
            searchKeyword={filters.search}
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            paymentStatusFilter={filters.paymentStatus}
            sortBy={filters.sort}
            onSearchChange={handleSearchChange}
            onDateFromChange={(e) =>
              setFilters({ ...filters, dateFrom: e.target.value })
            }
            onDateToChange={(e) =>
              setFilters({ ...filters, dateTo: e.target.value })
            }
            onPaymentStatusChange={(e) =>
              setFilters({ ...filters, paymentStatus: e.target.value })
            }
            onSortChange={(e) =>
              setFilters({ ...filters, sort: e.target.value })
            }
            onApplyFilter={handleApplyFilter}
            onClearFilter={handleClearFilter}
          />
        </div>

        <OrdersTable
          orders={orders}
          loading={fetching}
          totalOrders={pagination.total}
          totalPages={pagination.totalPages}
          currentPage={currentPage}
          onStatusUpdate={handleStatusUpdate}
          onViewDetails={setSelectedOrderId}
          onPageChange={(page) => {
            setCurrentPage(page);
            updateUrl(appliedFilters, page);
          }}
        />

        <OrderStatistics orders={orders} />
      </main>

      <OrderDetailModal
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<Loading />}>
      <OrdersPageContent />
    </Suspense>
  );
}

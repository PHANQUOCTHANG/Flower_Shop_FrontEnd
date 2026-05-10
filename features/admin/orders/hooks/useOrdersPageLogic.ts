import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useOrders,
  useUpdateOrderStatus,
} from "@/features/admin/orders/hooks/useOrder";
import type { GetOrdersParams } from "@/features/admin/orders/services/orderService";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

export function useOrdersPageLogic() {
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
  const updateUrl = useCallback(
    (newFilters: typeof filters, page: number) => {
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
    },
    [router]
  );

  const handleStatusChange = useCallback(
    (newStatus: string) => {
      const status = newStatus === "Tất cả" ? "all" : newStatus.toLowerCase();
      const nextFilters = { ...filters, status };
      setFilters(nextFilters);
      setAppliedFilters(nextFilters);
      setCurrentPage(1);
      updateUrl(nextFilters, 1);
    },
    [filters, updateUrl]
  );

  const handleApplyFilter = useCallback(() => {
    setAppliedFilters(filters);
    setCurrentPage(1);
    updateUrl(filters, 1);
  }, [filters, updateUrl]);

  const handleClearFilter = useCallback(() => {
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
  }, [router]);

  // Debounced Search Apply
  const debouncedSearchApply = useDebouncedCallback((nextFilters: typeof filters) => {
    setAppliedFilters(nextFilters);
    setCurrentPage(1);
    updateUrl(nextFilters, 1);
  }, 500);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      const nextFilters = { ...filters, search: val };
      setFilters(nextFilters);
      debouncedSearchApply(nextFilters);
    },
    [filters, debouncedSearchApply]
  );

  const handleStatusUpdate = useCallback(
    (orderId: string, status: string) => {
      updateStatus(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { orderId, status: status as any },
        { onSuccess: () => refetch() }
      );
    },
    [updateStatus, refetch]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      updateUrl(appliedFilters, page);
    },
    [appliedFilters, updateUrl]
  );

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

  return {
    state: {
      filters,
      appliedFilters,
      currentPage,
      selectedOrderId,
      orders,
      pagination,
      ordersLoading,
      fetching,
      tabs,
    },
    actions: {
      setFilters,
      setSelectedOrderId,
      handleStatusChange,
      handleApplyFilter,
      handleClearFilter,
      handleSearchChange,
      handleStatusUpdate,
      handlePageChange,
    },
  };
}

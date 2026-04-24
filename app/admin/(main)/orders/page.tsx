"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
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

  // Bộ lọc tạm thời (chưa được áp dụng)
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined,
  );
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Bộ lọc đã áp dụng (dùng để fetch dữ liệu từ API)
  const [appliedSearchKeyword, setAppliedSearchKeyword] = useState("");
  const [appliedStatus, setAppliedStatus] = useState<string | undefined>(
    undefined,
  );
  const [appliedDateFrom, setAppliedDateFrom] = useState("");
  const [appliedDateTo, setAppliedDateTo] = useState("");
  const [appliedPaymentStatus, setAppliedPaymentStatus] = useState("all");
  const [appliedSortBy, setAppliedSortBy] = useState("newest");

  // Trạng thái phân trang và UI
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Fetch danh sách đơn hàng từ API với các bộ lọc đã áp dụng
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
    search: appliedSearchKeyword || undefined,
    status:
      appliedStatus === "all"
        ? undefined
        : (appliedStatus as GetOrdersParams["status"]),
    paymentStatus:
      appliedPaymentStatus === "all"
        ? undefined
        : (appliedPaymentStatus as GetOrdersParams["paymentStatus"]),
    dateFrom: appliedDateFrom || undefined,
    dateTo: appliedDateTo || undefined,
    sort: appliedSortBy as GetOrdersParams["sort"],
  });

  const { updateStatus } = useUpdateOrderStatus();
  const totalOrders = pagination.total;

  // Khởi tạo trạng thái từ URL query params
  useEffect(() => {
    const keyword = searchParams.get("search") || "";
    const status = searchParams.get("status") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const dateFromParam = searchParams.get("dateFrom") || "";
    const dateToParam = searchParams.get("dateTo") || "";
    const paymentStatus = searchParams.get("paymentStatus") || "all";
    const sort = searchParams.get("sort") || "newest";

    setSearchKeyword(keyword);
    setSelectedStatus(status);
    setCurrentPage(page);
    setDateFrom(dateFromParam);
    setDateTo(dateToParam);
    setPaymentStatusFilter(paymentStatus);
    setSortBy(sort);

    setAppliedSearchKeyword(keyword);
    setAppliedStatus(status);
    setAppliedDateFrom(dateFromParam);
    setAppliedDateTo(dateToParam);
    setAppliedPaymentStatus(paymentStatus);
    setAppliedSortBy(sort);
  }, [searchParams]);

  // Cập nhật URL query params khi bộ lọc thay đổi
  const updateQueryParams = (
    keyword?: string,
    status?: string,
    page?: number,
    dateFromParam?: string,
    dateToParam?: string,
    paymentStatus?: string,
    sort?: string,
  ) => {
    const params = new URLSearchParams();

    if (keyword !== undefined) {
      if (keyword) params.set("search", keyword);
      setSearchKeyword(keyword);
    } else if (searchKeyword) {
      params.set("search", searchKeyword);
    }

    if (status !== undefined) {
      if (status) params.set("status", status);
      setSelectedStatus(status);
    } else if (selectedStatus) {
      params.set("status", selectedStatus);
    }

    const pageNum = page !== undefined ? page : currentPage;
    if (pageNum > 1) params.set("page", pageNum.toString());
    if (page !== undefined) setCurrentPage(pageNum);

    if (dateFromParam !== undefined) {
      if (dateFromParam) params.set("dateFrom", dateFromParam);
      setDateFrom(dateFromParam);
    } else if (dateFrom) {
      params.set("dateFrom", dateFrom);
    }

    if (dateToParam !== undefined) {
      if (dateToParam) params.set("dateTo", dateToParam);
      setDateTo(dateToParam);
    } else if (dateTo) {
      params.set("dateTo", dateTo);
    }

    const paymentStatusValue =
      paymentStatus !== undefined ? paymentStatus : paymentStatusFilter;
    if (paymentStatusValue !== "all")
      params.set("paymentStatus", paymentStatusValue);
    if (paymentStatus !== undefined) setPaymentStatusFilter(paymentStatusValue);

    const sortValue = sort !== undefined ? sort : sortBy;
    if (sortValue !== "newest") params.set("sort", sortValue);
    if (sort !== undefined) setSortBy(sortValue);

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "/admin/orders");
  };

  // Xử lý thay đổi từ khóa tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  // Xử lý thay đổi trạng thái đơn hàng
  const handleStatusChange = (newStatus: string) => {
    const status = newStatus === "Tất cả" ? undefined : newStatus.toLowerCase();
    setSelectedStatus(status);
    setAppliedStatus(status);
    setCurrentPage(1);
    updateQueryParams(
      appliedSearchKeyword,
      status,
      1,
      appliedDateFrom,
      appliedDateTo,
      appliedPaymentStatus,
      appliedSortBy,
    );
  };

  // Xử lý thay đổi sắp xếp
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value;
    setSortBy(sort);
    setAppliedSortBy(sort);
    setCurrentPage(1);
    updateQueryParams(
      appliedSearchKeyword,
      appliedStatus,
      1,
      appliedDateFrom,
      appliedDateTo,
      appliedPaymentStatus,
      sort,
    );
  };

  // Xử lý thay đổi ngày bắt đầu
  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFrom(e.target.value);
  };

  // Xử lý thay đổi ngày kết thúc
  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTo(e.target.value);
  };

  // Xử lý thay đổi trạng thái thanh toán
  const handlePaymentStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPaymentStatusFilter(e.target.value);
  };

  // Xử lý thay đổi trang
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateQueryParams(
      appliedSearchKeyword,
      appliedStatus,
      newPage,
      appliedDateFrom,
      appliedDateTo,
      appliedPaymentStatus,
      appliedSortBy,
    );
  };

  // Áp dụng bộ lọc và reset về trang 1
  const handleApplyFilter = () => {
    setAppliedSearchKeyword(searchKeyword);
    setAppliedStatus(selectedStatus);
    setAppliedDateFrom(dateFrom);
    setAppliedDateTo(dateTo);
    setAppliedPaymentStatus(paymentStatusFilter);
    setAppliedSortBy(sortBy);
    setCurrentPage(1);
    updateQueryParams(
      searchKeyword,
      selectedStatus,
      1,
      dateFrom,
      dateTo,
      paymentStatusFilter,
      sortBy,
    );
  };

  // Xóa tất cả bộ lọc
  const handleClearFilter = () => {
    setSearchKeyword("");
    setSelectedStatus(undefined);
    setDateFrom("");
    setDateTo("");
    setPaymentStatusFilter("all");
    setSortBy("newest");

    setAppliedSearchKeyword("");
    setAppliedStatus(undefined);
    setAppliedDateFrom("");
    setAppliedDateTo("");
    setAppliedPaymentStatus("all");
    setAppliedSortBy("newest");

    setCurrentPage(1);
    router.push("/admin/orders");
  };

  // Cập nhật trạng thái đơn hàng (optimistic update + refetch)
  const handleStatusUpdate = (orderId: string, status: string) => {
    updateStatus(
      {
        orderId,
        status: status as "pending" | "processing" | "completed" | "cancelled",
      },
      { onSuccess: () => refetch() },
    );
  };

  // Danh sách các tab trạng thái với số lượng
  const tabs = useMemo(
    () => [
      { name: "Tất cả", value: "all", count: totalOrders },
      {
        name: "Chờ xử lý",
        value: "pending",
        count: meta?.statusCounts?.pending | 0,
      },
      {
        name: "Đang giao",
        value: "processing",
        count: meta?.statusCounts?.processing | 0,
      },
      {
        name: "Đã giao",
        value: "completed",
        count: meta?.statusCounts?.completed | 0,
      },
      {
        name: "Đã hủy",
        value: "cancelled",
        count: meta?.statusCounts?.cancel | 0,
      },
    ],
    [totalOrders, orders],
  );

  // Chỉ hiển thị loading khi lần đầu tải (isPending), không block khi refetch
  if (ordersLoading) return <Loading />;

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f8f6] font-['Inter',_sans-serif] overflow-auto">
      <OrdersHeader />

      <main className="p-4 sm:p-6 md:p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-6 sm:gap-8 animate-in fade-in duration-500">
        <div className="space-y-6">
          <OrderStatusTabs
            tabs={tabs}
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
          />

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <OrderFilters
              searchKeyword={searchKeyword}
              dateFrom={dateFrom}
              dateTo={dateTo}
              paymentStatusFilter={paymentStatusFilter}
              sortBy={sortBy}
              onSearchChange={handleSearchChange}
              onDateFromChange={handleDateFromChange}
              onDateToChange={handleDateToChange}
              onPaymentStatusChange={handlePaymentStatusChange}
              onSortChange={handleSortChange}
              onApplyFilter={handleApplyFilter}
              onClearFilter={handleClearFilter}
            />
          </div>
        </div>

        <OrdersTable
          orders={orders}
          loading={fetching}
          totalOrders={totalOrders}
          totalPages={pagination.totalPages}
          currentPage={currentPage}
          onStatusUpdate={handleStatusUpdate}
          onViewDetails={setSelectedOrderId}
          onPageChange={handlePageChange}
        />

        <OrderStatistics orders={orders} />
      </main>

      {/* Modal lấy dữ liệu đơn hàng từ API qua orderId */}
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

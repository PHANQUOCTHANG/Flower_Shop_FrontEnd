"use client";

import React, { Suspense } from "react";
import { Loading } from "@/components/ui/Loading";
import {
  OrdersHeader,
  OrderStatusTabs,
  OrderFilters,
  OrdersTable,
  OrderStatistics,
  OrderDetailModal,
} from "@/features/admin/orders/components";
import { useOrdersPageLogic } from "@/features/admin/orders/hooks/useOrdersPageLogic";

function OrdersPageContent() {
  const { state, actions } = useOrdersPageLogic();

  if (state.ordersLoading) return <Loading />;

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f8f6] font-['Inter',_sans-serif] overflow-auto">
      <OrdersHeader />

      <main className="p-4 sm:p-6 md:p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-6 sm:gap-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100">
            <OrderStatusTabs
              tabs={state.tabs}
              selectedStatus={state.filters.status}
              onStatusChange={actions.handleStatusChange}
            />
          </div>

          <OrderFilters
            searchKeyword={state.filters.search}
            dateFrom={state.filters.dateFrom}
            dateTo={state.filters.dateTo}
            paymentStatusFilter={state.filters.paymentStatus}
            sortBy={state.filters.sort}
            onSearchChange={actions.handleSearchChange}
            onDateFromChange={(e) =>
              actions.setFilters({ ...state.filters, dateFrom: e.target.value })
            }
            onDateToChange={(e) =>
              actions.setFilters({ ...state.filters, dateTo: e.target.value })
            }
            onPaymentStatusChange={(e) =>
              actions.setFilters({
                ...state.filters,
                paymentStatus: e.target.value,
              })
            }
            onSortChange={(e) =>
              actions.setFilters({ ...state.filters, sort: e.target.value })
            }
            onApplyFilter={actions.handleApplyFilter}
            onClearFilter={actions.handleClearFilter}
          />
        </div>

        <OrdersTable
          orders={state.orders}
          loading={state.fetching}
          totalOrders={state.pagination.total}
          totalPages={state.pagination.totalPages}
          currentPage={state.currentPage}
          onStatusUpdate={actions.handleStatusUpdate}
          onViewDetails={actions.setSelectedOrderId}
          onPageChange={actions.handlePageChange}
        />

        <OrderStatistics orders={state.orders} />
      </main>

      <OrderDetailModal
        orderId={state.selectedOrderId}
        onClose={() => actions.setSelectedOrderId(null)}
        onStatusUpdate={actions.handleStatusUpdate}
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

// Trang quản lý tài khoản và hồ sơ người dùng

"use client";

import React, { useState, useCallback } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import Alert from "@/components/ui/Alert";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/features/auth/logout/hooks";
import { useFetchMyOrders } from "@/features/profile/hooks/useProfile";
import {
  ProfileSidebar,
  ProfileInfo,
  OrdersSection,
  AddressSection,
  ChangePasswordForm,
} from "@/features/profile/components";
import { OrderDetailModal } from "@/features/admin/orders/components";
import type { ProfileTabType } from "@/features/profile/constants/profile.constants";
import { ORDERS_PAGE_LIMIT } from "@/features/profile/constants/profile.constants";

export default function UserAccountPage() {
  const user = useAuthStore((state) => state.user);
  const { logout, isLoading: isLogoutLoading } = useLogout();

  // Tab được chọn hiện tại
  const [activeTab, setActiveTab] = useState<ProfileTabType>("profile");
  // Thông báo thành công
  const [successMessage, setSuccessMessage] = useState("");
  // Trang đơn hàng hiện tại
  const [page, setPage] = useState(1);
  // Bộ lọc trạng thái đơn hàng
  const [status, setStatus] = useState<string>("");
  // Bộ lọc sắp xếp đơn hàng
  const [sort, setSort] = useState<string>("newest");
  // ID đơn hàng được chọn để xem chi tiết
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  // Trạng thái loading khi làm mới danh sách
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Lấy dữ liệu đơn hàng từ API
  const {
    orders,
    meta,
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useFetchMyOrders({
    page,
    limit: ORDERS_PAGE_LIMIT,
    status,
    sort,
  });

  // Xử lý đăng xuất
  const handleLogout = useCallback(async () => {
    setSuccessMessage("Đăng xuất thành công! Chuyển hướng...");
    await logout();
  }, [logout]);

  // Xử lý làm mới danh sách đơn hàng
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetchOrders?.();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchOrders]);

  // Xử lý khi thay đổi tab
  const handleTabChange = useCallback((tab: ProfileTabType) => {
    setActiveTab(tab);
  }, []);

  // Xử lý khi thay đổi trạng thái bộ lọc
  const handleStatusChange = useCallback((newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  }, []);

  // Xử lý khi thay đổi bộ lọc sắp xếp
  const handleSortChange = useCallback((newSort: string) => {
    setSort(newSort);
    setPage(1);
  }, []);

  return (
    <div className="min-h-screen bg-[#fcf8f9] font-['Inter',_sans-serif] text-slate-900 transition-colors duration-300">
      {/* Thông báo thành công */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm">
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage("")}
            autoClose={false}
          />
        </div>
      )}

      {/* Main content */}
      <main className="mx-auto w-full max-w-[1300px] px-6 md:px-12 py-10 animate-in fade-in duration-700">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Tài khoản của tôi" },
          ]}
        />

        {/* Layout: Sidebar + Content */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <ProfileSidebar
            userName={user?.name}
            avatarUrl={user?.avatar}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onLogout={handleLogout}
            isLogoutLoading={isLogoutLoading}
          />

          {/* Content area */}
          <div className="flex-1 space-y-8">
            {/* Tab: Thông tin cá nhân */}
            {activeTab === "profile" && (
              <ProfileInfo
                fields={[
                  { label: "Họ và tên", value: user?.name || "N/A" },
                  { label: "Email liên hệ", value: user?.email || "N/A" },
                  {
                    label: "Số điện thoại",
                    value: user?.phone || "Chưa cập nhật",
                  },
                  {
                    label: "Giới tính",
                    value: user?.gender || "Chưa cập nhật",
                  },
                ]}
                onEdit={() => {
                  // TODO: Implement edit profile functionality
                }}
              />
            )}

            {/* Tab: Đơn hàng */}
            {activeTab === "orders" && (
              <OrdersSection
                orders={orders}
                meta={meta}
                isLoading={ordersLoading}
                error={ordersError}
                currentPage={page}
                onPageChange={setPage}
                status={status}
                onStatusChange={handleStatusChange}
                sort={sort}
                onSortChange={handleSortChange}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
                onViewOrder={(orderId) => setSelectedOrderId(orderId)}
              />
            )}

            {/* Tab: Sổ địa chỉ */}
            {activeTab === "address" && (
              <AddressSection
                onAddAddress={() => {
                  // TODO: Implement add address functionality
                }}
              />
            )}

            {/* Tab: Đổi mật khẩu */}
            {activeTab === "password" && <ChangePasswordForm />}
          </div>
        </div>
      </main>

      {/* Order detail modal */}
      <OrderDetailModal
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        onStatusUpdate={() => {
          // Optional: Refresh orders list after status update
        }}
      />
    </div>
  );
}

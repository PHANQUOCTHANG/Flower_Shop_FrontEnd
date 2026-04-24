// Trang quản lý tài khoản và hồ sơ người dùng

"use client";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import Alert from "@/components/ui/Alert";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/features/auth/logout/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useFetchMyOrders } from "@/features/profile/hooks/useProfile";
import {
  ProfileSidebar,
  ProfileInfo,
  OrdersSection,
  AddressSection,
  ChangePasswordForm,
  ReviewFormModal,
} from "@/features/profile/components";
import { OrderDetailModal } from "@/features/admin/orders/components";
import type { ProfileTabType } from "@/features/profile/constants/profile.constants";
import { ORDERS_PAGE_LIMIT } from "@/features/profile/constants/profile.constants";

interface ReviewModalState {
  isOpen: boolean;
  productId: string;
  productName: string;
  productImage?: string;
  orderId: string;
}

const INITIAL_REVIEW_MODAL: ReviewModalState = {
  isOpen: false,
  productId: "",
  productName: "",
  productImage: undefined,
  orderId: "",
};

function UserAccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const user = useAuthStore((state) => state.user);
  const { logout, isLoading: isLogoutLoading } = useLogout();

  // Đọc tab từ URL, mặc định là "profile"
  const urlTab = searchParams.get("tab") as ProfileTabType | null;
  const [activeTab, setActiveTab] = useState<ProfileTabType>(urlTab || "profile");
  const [successMessage, setSuccessMessage] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");
  
  // Đọc orderId từ URL (để tải lại trang vẫn giữ nguyên popup)
  const urlOrderId = searchParams.get("orderId");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(urlOrderId);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reviewModal, setReviewModal] = useState<ReviewModalState>(INITIAL_REVIEW_MODAL);
  const queryClient = useQueryClient();

  // Sync active tab khi URL param thay đổi
  useEffect(() => {
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  // Sync orderId từ URL khi user navigate bằng back/forward
  useEffect(() => {
    if (urlOrderId !== selectedOrderId) {
      setSelectedOrderId(urlOrderId);
    }
  }, [urlOrderId]);

  // Lấy dữ liệu đơn hàng — chỉ enable khi activeTab === "orders"
  const {
    orders,
    meta,
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useFetchMyOrders(
    { page, limit: ORDERS_PAGE_LIMIT, status, sort },
    activeTab === "orders",
  );

  const handleLogout = useCallback(async () => {
    setSuccessMessage("Đăng xuất thành công! Chuyển hướng...");
    await logout();
  }, [logout]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      if (selectedOrderId) {
        await queryClient.invalidateQueries({
          queryKey: ["admin", "orders", "detail", selectedOrderId],
        });
      }
      await refetchOrders?.();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchOrders, queryClient, selectedOrderId]);

  const handleTabChange = useCallback(
    (tab: ProfileTabType) => {
      setActiveTab(tab);
      if (tab === "profile") {
        router.replace(`/profile`);
      } else {
        router.replace(`/profile?tab=${tab}`);
      }
    },
    [router],
  );

  const handleStatusChange = useCallback((newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((newSort: string) => {
    setSort(newSort);
    setPage(1);
  }, []);

  // Set selected order and update URL without full reload
  const handleViewOrder = useCallback(
    (orderId: string) => {
      setSelectedOrderId(orderId);
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("orderId", orderId);
      router.replace(`/profile?${newParams.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // Close order and revert URL
  const handleCloseOrderModal = useCallback(() => {
    setSelectedOrderId(null);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("orderId");
    router.replace(`/profile?${newParams.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handleReviewClick = useCallback(
    (productId: string, productName: string, productImage?: string) => {
      setReviewModal({
        isOpen: true,
        productId,
        productName,
        productImage,
        orderId: selectedOrderId || "",
      });
    },
    [selectedOrderId],
  );

  const handleCloseReviewModal = useCallback(() => {
    setReviewModal(INITIAL_REVIEW_MODAL);
  }, []);

  return (
    <div className="min-h-screen bg-[#fcf8f9] font-['Inter',_sans-serif] text-slate-900 transition-colors duration-300">
      {/* Thông báo thành công */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 left-4 sm:bottom-6 sm:right-6 sm:left-auto sm:max-w-sm z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage("")}
            autoClose={false}
          />
        </div>
      )}

      <main className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-10 animate-in fade-in duration-700">
        <Breadcrumbs
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Tài khoản của tôi" },
          ]}
        />

        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-10">
          {/* Sidebar */}
          <ProfileSidebar
            userName={user?.name}
            avatarUrl={user?.avatar ?? undefined}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onLogout={handleLogout}
            isLogoutLoading={isLogoutLoading}
          />

          {/* Content */}
          <div className="flex-1 space-y-8">
            {activeTab === "profile" && (
              <ProfileInfo
                fields={[
                  { label: "Họ và tên", value: user?.name || "N/A" },
                  { label: "Email liên hệ", value: user?.email || "N/A" },
                  { label: "Số điện thoại", value: user?.phone || "Chưa cập nhật" },
                  { label: "Giới tính", value: user?.gender || "Chưa cập nhật" },
                ]}
                onEdit={() => {
                  // TODO: Implement edit profile
                }}
              />
            )}

            {activeTab === "orders" && (
              <OrdersSection
                orders={orders}
                meta={meta}
                isLoading={ordersLoading}
                error={
                  ordersError instanceof Error
                    ? ordersError.message
                    : (ordersError as string | null)
                }
                currentPage={page}
                onPageChange={setPage}
                status={status}
                onStatusChange={handleStatusChange}
                sort={sort}
                onSortChange={handleSortChange}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
                onViewOrder={handleViewOrder}
              />
            )}

            {activeTab === "address" && <AddressSection />}
            {activeTab === "password" && <ChangePasswordForm />}
          </div>
        </div>
      </main>

      {/* Order Detail Modal */}
      <OrderDetailModal
        orderId={selectedOrderId}
        onClose={handleCloseOrderModal}
        onStatusUpdate={() => {}}
        role="CUSTOMER"
        onReviewClick={handleReviewClick}
      />

      {/* Review Form Modal */}
      <ReviewFormModal
        isOpen={reviewModal.isOpen}
        onClose={handleCloseReviewModal}
        productId={reviewModal.productId}
        productName={reviewModal.productName}
        productImage={reviewModal.productImage}
        orderId={reviewModal.orderId}
        onSuccess={handleRefresh}
      />
    </div>
  );
}

export default function UserAccountPage() {
  return (
    <Suspense fallback={null}>
      <UserAccountContent />
    </Suspense>
  );
}

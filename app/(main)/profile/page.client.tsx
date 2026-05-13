"use client";

import React from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import Alert from "@/components/ui/Alert";
import {
  ProfileSidebar,
  ProfileDashboard,
  OrdersSection,
  AddressSection,
  ChangePasswordForm,
} from "@/features/profile/components";
import dynamic from "next/dynamic";
import {
  useProfilePageLogic,
  INITIAL_REVIEW_MODAL,
} from "@/features/profile/hooks/useProfilePageLogic";

const ReviewFormModal = dynamic(
  () => import("@/features/profile/components").then((mod) => mod.ReviewFormModal),
  { ssr: false }
);

const OrderDetailModal = dynamic(
  () => import("@/features/admin/orders/components").then((mod) => mod.OrderDetailModal),
  { ssr: false }
);

const ConfirmDialog = dynamic(
  () => import("@/components/ui/ConfirmDialog").then((mod) => mod.ConfirmDialog),
  { ssr: false }
);

export default function UserAccountContent() {

  const { state, actions } = useProfilePageLogic();

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter',sans-serif] text-slate-900">
      
      {/* Khối thông báo thành công */}
      {state.successMessage && (
        <div className="fixed bottom-4 right-4 left-4 sm:bottom-6 sm:right-6 sm:left-auto sm:max-w-sm z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Alert
            type="success"
            message={state.successMessage}
            onClose={() => actions.setSuccessMessage("")}
            autoClose={false}
          />
        </div>
      )}

      <main className="mx-auto w-full max-w-350 px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 animate-in fade-in duration-700">
        
        {/* Điều hướng (Breadcrumb) */}
        <Breadcrumbs
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Tài khoản của tôi" },
          ]}
        />

        <div className="mt-6 flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Cột trái: Sidebar Menu */}
          <ProfileSidebar
            activeTab={state.activeTab}
            onTabChange={actions.handleTabChange}
            onLogout={() => actions.setShowLogoutConfirm(true)}
            isLogoutLoading={state.isLogoutLoading}
          />

          {/* Cột phải: Nội dung chính */}
          <div className="flex-1 min-w-0">
            <div
              style={{
                opacity: state.visible ? 1 : 0,
                transform: state.visible ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 150ms ease, transform 150ms ease",
              }}
            >
              {state.activeTab === "profile" && (
                <ProfileDashboard
                  user={state.user}
                  orders={state.orders || []}
                  onNavigateTab={actions.handleTabChange}
                />
              )}
              {state.activeTab === "orders" && (
                <OrdersSection
                  orders={state.orders}
                  meta={state.meta}
                  isLoading={state.ordersLoading}
                  error={state.ordersError?.message}
                  currentPage={state.page}
                  onPageChange={actions.setPage}
                  status={state.status}
                  onStatusChange={(s) => {
                    actions.setStatus(s);
                    actions.setPage(1);
                  }}
                  sort={state.sort}
                  onSortChange={(s) => {
                    actions.setSort(s);
                    actions.setPage(1);
                  }}
                  onRefresh={actions.handleRefresh}
                  isRefreshing={state.isRefreshing}
                  onViewOrder={actions.handleViewOrder}
                />
              )}
              {state.activeTab === "address" && <AddressSection />}
              {state.activeTab === "password" && <ChangePasswordForm />}
            </div>
          </div>
        </div>
      </main>

      {/* Modal: Chi tiết đơn hàng */}
      <OrderDetailModal
        orderId={state.selectedOrderId}
        onClose={actions.handleCloseOrderModal}
        onStatusUpdate={() => {}}
        role="CUSTOMER"
        onReviewClick={actions.handleReviewClick}
      />

      {/* Modal: Đánh giá sản phẩm */}
      <ReviewFormModal
        isOpen={state.reviewModal.isOpen}
        onClose={() => actions.setReviewModal(INITIAL_REVIEW_MODAL)}
        productId={state.reviewModal.productId}
        productName={state.reviewModal.productName}
        productImage={state.reviewModal.productImage}
        orderId={state.reviewModal.orderId}
        onSuccess={actions.handleRefresh}
      />

      {/* Dialog: Xác nhận đăng xuất */}
      <ConfirmDialog
        isOpen={state.showLogoutConfirm}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?"
        confirmLabel="Đăng xuất"
        cancelLabel="Hủy"
        onConfirm={actions.confirmLogout}
        onCancel={() => actions.setShowLogoutConfirm(false)}
        isLoading={state.isLogoutLoading}
        type="danger"
      />
    </div>
  );
}

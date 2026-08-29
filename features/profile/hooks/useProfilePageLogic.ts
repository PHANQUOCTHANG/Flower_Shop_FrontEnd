import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/features/auth/logout/hooks";
import { getSocket } from "@/lib/socket";
import { useFetchMyOrders } from "@/features/profile/hooks/useProfile";
import type { ProfileTabType } from "@/features/profile/constants/profile.constants";
import { ORDERS_PAGE_LIMIT } from "@/features/profile/constants/profile.constants";

export interface ReviewModalState {
  isOpen: boolean;
  productId: string;
  productName: string;
  productImage?: string;
  orderId: string;
}

export const INITIAL_REVIEW_MODAL: ReviewModalState = {
  isOpen: false,
  productId: "",
  productName: "",
  productImage: undefined,
  orderId: "",
};

export function useProfilePageLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // --- Auth ---
  const user = useAuthStore((state) => state.user);
  const { logout, isLoading: isLogoutLoading } = useLogout();

  // --- Params từ URL ---
  const urlTab = searchParams.get("tab") as ProfileTabType | null;
  const urlOrderId = searchParams.get("orderId");

  // --- Trạng thái cục bộ (Local State) ---
  const [activeTab, setActiveTab] = useState<ProfileTabType>(urlTab || "profile");
  const [successMessage, setSuccessMessage] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");
  const [visible, setVisible] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(urlOrderId);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reviewModal, setReviewModal] = useState<ReviewModalState>(INITIAL_REVIEW_MODAL);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // --- Fetch API: Đơn hàng của tôi ---
  const {
    orders,
    meta,
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useFetchMyOrders(
    { page, limit: ORDERS_PAGE_LIMIT, status, sort },
    activeTab === "orders" || activeTab === "profile",
  );

  // --- Đồng bộ hóa URL (Sync state with URL) ---
  useEffect(() => {
    if (urlTab && urlTab !== activeTab) setActiveTab(urlTab);
  }, [urlTab, activeTab]);

  useEffect(() => {
    if (urlOrderId !== selectedOrderId) setSelectedOrderId(urlOrderId);
  }, [urlOrderId, selectedOrderId]);

  // --- Realtime Socket (Cập nhật trạng thái đơn hàng) ---
  useEffect(() => {
    if (!user?.id) return;
    const socket = getSocket();
    if (!socket) return;

    const onStatusUpdated = (payload: { orderId: string; status: string }) => {
      // Làm mới danh sách đơn hàng
      queryClient.invalidateQueries({ queryKey: ["orders", "my-orders"] });
      // Làm mới chi tiết đơn hàng nếu đang mở
      if (selectedOrderId === payload.orderId) {
        queryClient.invalidateQueries({
          queryKey: ["admin", "orders", "detail", payload.orderId],
        });
      }
    };

    socket.on("order:status_updated", onStatusUpdated);
    return () => {
      socket.off("order:status_updated", onStatusUpdated);
    };
  }, [user?.id, queryClient, selectedOrderId]);

  // --- Các hàm xử lý (Handlers) ---

  // Xử lý chuyển tab ngay lập tức để không có cảm giác lag
  const handleTabChange = useCallback(
    (tab: ProfileTabType) => {
      if (tab === activeTab) return;
      
      // Update URL first without blocking
      router.replace(tab === "profile" ? "/profile" : `/profile?tab=${tab}`, { scroll: false });
      
      // Update state
      setVisible(false);
      setTimeout(() => {
        setActiveTab(tab);
        setVisible(true);
      }, 50); // Chỉ delay 50ms cho hiệu ứng mờ nháy siêu nhanh, hoặc ta có thể bỏ hẳn
    },
    [router, activeTab],
  );

  // Xử lý làm mới dữ liệu
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

  // Xem chi tiết đơn hàng (Cập nhật URL)
  const handleViewOrder = useCallback(
    (orderId: string) => {
      setSelectedOrderId(orderId);
      const params = new URLSearchParams(searchParams.toString());
      params.set("orderId", orderId);
      router.replace(`/profile?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // Đóng modal chi tiết đơn hàng
  const handleCloseOrderModal = useCallback(() => {
    setSelectedOrderId(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("orderId");
    router.replace(`/profile?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  // Mở modal đánh giá sản phẩm
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

  // Xác nhận đăng xuất
  const confirmLogout = useCallback(async () => {
    setShowLogoutConfirm(false);
    setSuccessMessage("Đăng xuất thành công! Chuyển hướng...");
    await logout();
  }, [logout]);

  return {
    state: {
      user,
      activeTab,
      successMessage,
      page,
      status,
      sort,
      visible,
      selectedOrderId,
      isRefreshing,
      reviewModal,
      showLogoutConfirm,
      isLogoutLoading,
      orders,
      meta,
      ordersLoading,
      ordersError,
    },
    actions: {
      setSuccessMessage,
      setPage,
      setStatus,
      setSort,
      setShowLogoutConfirm,
      setReviewModal,
      handleTabChange,
      handleRefresh,
      handleViewOrder,
      handleCloseOrderModal,
      handleReviewClick,
      confirmLogout,
    },
  };
}

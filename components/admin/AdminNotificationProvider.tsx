"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/stores/auth.store";
import { useSocket } from "@/providers/socket-provider";
import { logKeys } from "@/features/admin/activity-log/hooks/useActivityLog";

import { formatCurrency } from "@/utils/format";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderNotification {
  id: string; // random id dùng để remove khỏi queue
  type: "new" | "cancelled";
  orderId: string;
  totalPrice: number;
  message: string;
  createdAt: string;
}

interface NotificationContextType {
  notifications: OrderNotification[];
  dismissNotification: (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  dismissNotification: () => {},
});

export const useAdminNotifications = () => useContext(NotificationContext);

// ─── Provider ─────────────────────────────────────────────────────────────────

const TOAST_DURATION_MS = 10000;

export function AdminNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const playSound = useCallback((type: "new" | "cancelled") => {
    try {
      console.log(
        `[AdminNotificationProvider] Playing sound for type: ${type}`,
      );
      const soundUrl =
        type === "new"
          ? "https://cdnjs.cloudflare.com/ajax/libs/ion-sound/3.0.2/sounds/bell_ring.mp3"
          : "https://cdnjs.cloudflare.com/ajax/libs/ion-sound/3.0.2/sounds/button_tiny.mp3";

      const audio = new Audio(soundUrl);
      audio.volume = 1.0; // Slightly quieter
      audio
        .play()
        .then(() =>
          console.log("[AdminNotificationProvider] Audio played successfully"),
        )
        .catch((e) =>
          console.warn(
            "[AdminNotificationProvider] Audio play blocked by browser:",
            e,
          ),
        );
    } catch (error) {
      console.error(
        "[AdminNotificationProvider] Failed to play notification sound:",
        error,
      );
    }
  }, []);

  const addNotification = useCallback(
    (payload: Omit<OrderNotification, "id">) => {
      console.log(
        "[AdminNotificationProvider] addNotification called with payload:",
        payload,
      );
      const id = `notif-${Date.now()}-${Math.random()}`;
      const notification: OrderNotification = { ...payload, id };

      setNotifications((prev) => [notification, ...prev]);
      playSound(payload.type);

      const timer = setTimeout(
        () => dismissNotification(id),
        TOAST_DURATION_MS,
      );
      timersRef.current.set(id, timer);
    },
    [dismissNotification, playSound],
  );

  const { isConnected } = useSocket();

  useEffect(() => {
    const role = user?.role?.toUpperCase();
    const isAdmin = role === "ADMIN" || role === "STAFF";
    if (!isAdmin || !isConnected) return;

    const socket = getSocket();
    if (!socket) {
      console.log("[AdminNotificationProvider] No socket instance found.");
      return;
    }

    console.log(
      "[AdminNotificationProvider] Registering socket events for role:",
      role,
    );

    const handleNewOrder = (payload: {
      orderId: string;
      totalPrice: number;
      message: string;
      createdAt: string;
    }) => {
      console.log(
        "[AdminNotificationProvider] New order received:",
        payload.orderId,
      );
      addNotification({ ...payload, type: "new" });

      // Refetch tất cả active order list queries ngay lập tức (refetch trang order)
      queryClient.invalidateQueries({
        queryKey: ["admin", "orders", "list"],
        exact: false,
        refetchType: "active",
      });

      // Invalidate activity log
      queryClient.invalidateQueries({ queryKey: logKeys.unread() });
      queryClient.invalidateQueries({ queryKey: logKeys.lists() });
    };

    const handleCancelledOrder = (payload: {
      orderId: string;
      totalPrice: number;
      message: string;
      createdAt: string;
    }) => {
      console.log(
        "[AdminNotificationProvider] Order cancelled:",
        payload.orderId,
      );
      addNotification({ ...payload, type: "cancelled" });

      // Refetch order list
      queryClient.invalidateQueries({
        queryKey: ["admin", "orders", "list"],
        exact: false,
        refetchType: "active",
      });

      // Refetch order detail nếu đang xem chi tiết order đó
      queryClient.invalidateQueries({
        queryKey: ["admin", "orders", "detail", payload.orderId],
      });

      // Invalidate activity log
      queryClient.invalidateQueries({ queryKey: logKeys.unread() });
      queryClient.invalidateQueries({ queryKey: logKeys.lists() });
    };

    socket.on("order:new", handleNewOrder);
    socket.on("order:cancelled", handleCancelledOrder);

    return () => {
      socket.off("order:new", handleNewOrder);
      socket.off("order:cancelled", handleCancelledOrder);
    };
  }, [user?.role, addNotification, queryClient, isConnected]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, dismissNotification }}
    >
      {children}
      <NotificationToastStack
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </NotificationContext.Provider>
  );
}

// ─── Toast Stack UI ───────────────────────────────────────────────────────────

function NotificationToastStack({
  notifications,
  onDismiss,
}: {
  notifications: OrderNotification[];
  onDismiss: (id: string) => void;
}) {
  if (notifications.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "1.25rem",
        right: "1.25rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.625rem",
        pointerEvents: "none",
      }}
    >
      {notifications.map((n) => (
        <OrderToast key={n.id} notification={n} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// ─── Single Toast ─────────────────────────────────────────────────────────────

function OrderToast({
  notification,
  onDismiss,
}: {
  notification: OrderNotification;
  onDismiss: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  const isCancelled = notification.type === "cancelled";

  const colors = isCancelled
    ? {
        border: "rgba(238, 43, 91, 0.2)",
        shadow: "rgba(238, 43, 91, 0.1)",
        iconBg: "var(--danger)",
        labelBg: "rgba(238, 43, 91, 0.05)",
        labelBorder: "rgba(238, 43, 91, 0.15)",
        labelTitle: "#be123c",
        labelValue: "#9f1239",
      }
    : {
        border: "rgba(19, 236, 91, 0.2)",
        shadow: "rgba(19, 236, 91, 0.1)",
        iconBg: "var(--primary)",
        labelBg: "rgba(19, 236, 91, 0.05)",
        labelBorder: "rgba(19, 236, 91, 0.15)",
        labelTitle: "#059669",
        labelValue: "#047857",
      };

  return (
    <div
      onClick={handleDismiss}
      style={{
        pointerEvents: "all",
        cursor: "pointer",
        minWidth: "320px",
        maxWidth: "380px",
        background: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${colors.border}`,
        borderRadius: "16px",
        padding: "16px 18px",
        boxShadow: `0 12px 40px -12px ${colors.shadow}, 0 0 0 1px rgba(0,0,0,0.02)`,
        transform: visible ? "translateX(0)" : "translateX(110%)",
        opacity: visible ? 1 : 0,
        transition:
          "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
        display: "flex",
        gap: "14px",
        alignItems: "flex-start",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "12px",
          background: colors.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: "20px",
          boxShadow: "0 4px 12px -2px rgba(0,0,0,0.1)",
        }}
      >
        {isCancelled ? "❌" : "🛍️"}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: "#0f172a",
            fontWeight: 800,
            fontSize: "14px",
            marginBottom: "2px",
            letterSpacing: "-0.01em",
          }}
        >
          {isCancelled ? "Khách đã hủy đơn!" : "Đơn hàng mới!"}
        </div>
        <div
          style={{
            color: "#64748b",
            fontSize: "13px",
            lineHeight: 1.5,
            marginBottom: "8px",
          }}
        >
          {notification.message}
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: colors.labelBg,
            border: `1px solid ${colors.labelBorder}`,
            borderRadius: "6px",
            padding: "3px 8px",
          }}
        >
          <span
            style={{
              color: colors.labelTitle,
              fontSize: "11px",
              fontWeight: 600,
            }}
          >
            Giá trị
          </span>
          <span
            style={{
              color: colors.labelValue,
              fontSize: "13px",
              fontWeight: 800,
            }}
          >
            {formatCurrency(notification.totalPrice)}
          </span>
        </div>
      </div>

      {/* Close */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
        style={{
          background: "none",
          border: "none",
          color: "#94a3b8",
          cursor: "pointer",
          padding: "4px",
          fontSize: "14px",
          lineHeight: 1,
          flexShrink: 0,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.color = "#0f172a";
          el.style.backgroundColor = "rgba(0,0,0,0.05)";
          el.style.borderRadius = "6px";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.color = "#94a3b8";
          el.style.backgroundColor = "transparent";
        }}
        aria-label="Đóng thông báo"
      >
        ✕
      </button>

      {/* Progress bar */}
      <ProgressBar durationMs={TOAST_DURATION_MS} isCancelled={isCancelled} />
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({
  durationMs,
  isCancelled,
}: {
  durationMs: number;
  isCancelled: boolean;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Kích hoạt animation sau 1 frame
    const frame = requestAnimationFrame(() => setActive(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "3px",
        background: "rgba(0,0,0,0.03)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: active ? "0%" : "100%",
          background: isCancelled ? "var(--danger)" : "var(--primary)",
          transition: active ? `width ${durationMs}ms linear` : "none",
        }}
      />
    </div>
  );
}

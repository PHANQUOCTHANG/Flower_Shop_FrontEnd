"use client";

import { useEffect, useState, useCallback } from "react";
import { getSocket, initializeSocket } from "@/lib/socket";
import { useAuthStore } from "@/stores/auth.store";

export interface OrderStatusEvent {
  jobId: string;
  status: "queued" | "processing" | "completed" | "failed";
  message: string;
  data?: {
    orderId: string;
    totalPrice: number;
  };
}

interface UseOrderStatusOptions {
  jobId?: string;
  enabled?: boolean;
  onStatusChange?: (event: OrderStatusEvent) => void;
}

export const useOrderStatus = (options?: UseOrderStatusOptions) => {
  const { jobId, enabled = true, onStatusChange } = options || {};
  const { user, accessToken } = useAuthStore();
  const [status, setStatus] = useState<OrderStatusEvent | null>(null);
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(
    (currentJobId: string) => {
      if (!enabled || !accessToken) {
        console.log(
          "[useOrderStatus] Not listening - enabled:",
          enabled,
          "has token:",
          !!accessToken,
        );
        return;
      }

      try {
        console.log(
          "[useOrderStatus] Starting to listen for jobId:",
          currentJobId,
        );
        const socket = getSocket() || initializeSocket(accessToken);

        if (!socket.connected) {
          console.log(
            "[useOrderStatus] Socket not connected, connecting now...",
          );
          socket.connect();
        }

        // Remove listener cũ trước (avoid duplicate listeners)
        socket.off("order:status");

        socket.on("order:status", (event: OrderStatusEvent) => {
          console.log(
            "[useOrderStatus] Received event:",
            event,
            "expecting jobId:",
            currentJobId,
          );
          if (event.jobId === currentJobId) {
            console.log(
              "[useOrderStatus] Event matches jobId, updating status",
            );
            setStatus(event);
            onStatusChange?.(event);
          }
        });

        setIsListening(true);
      } catch (error) {
        console.error("[useOrderStatus] Error initializing socket:", error);
      }
    },
    [enabled, accessToken, onStatusChange],
  );

  const stopListening = useCallback(() => {
    const socket = getSocket();
    if (socket) {
      socket.off("order:status");
      setIsListening(false);
    }
  }, []);

  useEffect(() => {
    if (jobId && enabled) {
      startListening(jobId);
    }

    return () => {
      stopListening();
    };
  }, [jobId, enabled, startListening, stopListening]);

  return {
    status,
    isListening,
    startListening,
    stopListening,
  };
};

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeSocket, closeSocket, getSocket } from "@/lib/socket";
import { useAuthStore } from "@/stores/auth.store";

interface SocketContextType {
  isConnected: boolean;
  isInitializing: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, accessToken } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      // Nếu user logout, close socket
      closeSocket();
      setIsConnected(false);
      return;
    }

    // Nếu user login, khởi tạo socket
    const initSocket = async () => {
      try {
        setIsInitializing(true);
        console.log(
          "[SocketProvider] Initializing socket with userId:",
          user?.id,
        );
        const socket = initializeSocket(accessToken);

        socket.on("connect", () => {
          console.log("[SocketProvider] Socket connected, userId:", user?.id);
          setIsConnected(true);
        });

        socket.on("disconnect", () => {
          console.log("[SocketProvider] Socket disconnected");
          setIsConnected(false);
        });

        socket.on("connect_error", (error: any) => {
          console.error("[SocketProvider] Connection error:", error);
        });

        setIsInitializing(false);
      } catch (error) {
        console.error("[SocketProvider] Error initializing socket:", error);
        setIsInitializing(false);
      }
    };

    initSocket();

    return () => {
      // Cleanup: close socket khi component unmount
      // Nhưng vẫn giữ socket sống nếu user còn login
    };
  }, [accessToken]);

  return (
    <SocketContext.Provider value={{ isConnected, isInitializing }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeSocket, closeSocket, getSocket, updateSocketToken } from "@/lib/socket";
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

    // Nếu socket đã tồn tại → chỉ cập nhật token, không đăng ký listener mới
    const existingSocket = getSocket();
    if (existingSocket) {
      updateSocketToken(accessToken);
      return;
    }

    // Nếu user login lần đầu, khởi tạo socket
    setIsInitializing(true);
    const socket = initializeSocket(accessToken);

    // Đặt tên handler để cleanup chính xác — tránh remove listener của component khác
    const handleConnect = () => {
      console.log("[SocketProvider] Socket connected, userId:", user?.id);
      setIsConnected(true);
      setIsInitializing(false); // Đã connected thật → dừng loading
    };

    const handleDisconnect = () => {
      console.log("[SocketProvider] Socket disconnected");
      setIsConnected(false);
    };

    const handleError = (error: any) => {
      console.error("[SocketProvider] Connection error:", error.message);
      setIsInitializing(false); // Lỗi thật → dừng loading
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);

    return () => {
      // ✅ Remove đúng listener đã đăng ký — không ảnh hưởng listener của component khác
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
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

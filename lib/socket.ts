import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initializeSocket = (token: string): Socket => {
  if (socket?.connected) {
    console.log("[Socket] Socket already connected, returning existing");
    return socket;
  }

  // Socket.io cần kết nối đến base URL (không có /api)
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "http://localhost:5000";

  console.log("[Socket] Initializing new connection to:", baseUrl);
  socket = io(baseUrl, {
    auth: {
      token,
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("[Socket] Connected to server, socket.id:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("[Socket] Disconnected from server");
  });

  socket.on("connect_error", (error) => {
    console.error("[Socket] Connection error:", error);
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const closeSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
  }
};

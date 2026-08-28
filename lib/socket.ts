import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

// Token hiện tại — được cập nhật mỗi khi refresh
let currentToken: string = "";

/**
 * Lấy base URL cho socket connection.
 * Socket.IO phải kết nối trực tiếp đến Render backend (không qua proxy Vercel)
 */
const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ||
  "http://localhost:5000";

/**
 * Khởi tạo socket lần đầu với token.
 * Nếu socket đã tồn tại, chỉ cập nhật token — không tạo kết nối mới.
 */
export const initializeSocket = (token: string): Socket => {
  currentToken = token;

  // Socket đang connected → chỉ cập nhật token, không tạo lại
  if (socket?.connected) {
    socket.auth = { token: currentToken };
    return socket;
  }

  // Socket đã tồn tại nhưng đang disconnect → cập nhật token rồi reconnect
  if (socket) {
    socket.auth = { token: currentToken };
    socket.connect();
    return socket;
  }

  // Lần đầu tiên → tạo mới
  const baseUrl = getBaseUrl();
  console.log("[Socket] Initializing new connection to:", baseUrl);

  socket = io(baseUrl, {
    // Dùng function thay vì object tĩnh:
    // Socket.IO sẽ gọi lại hàm này mỗi lần reconnect → luôn lấy token mới nhất
    auth: (cb) => cb({ token: currentToken }),
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("[Socket] Connected, socket.id:", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket] Disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("[Socket] Connection error:", error.message);
    // Nếu lỗi do token (401) → dừng auto-reconnect để tránh spam request
    // Token mới sẽ được inject qua updateSocketToken() khi auth store refresh
    if (error.message?.includes("401") || error.message?.includes("jwt")) {
      console.warn("[Socket] Auth error — waiting for token refresh");
      socket?.io.opts.reconnectionAttempts === 0;
    }
  });

  return socket;
};

/**
 * Cập nhật token cho socket đang chạy mà không cần disconnect/reconnect.
 * Gọi hàm này ngay sau khi Axios interceptor refresh token thành công.
 *
 * - Nếu socket đang connected: cập nhật auth.token để lần reconnect tiếp theo dùng token mới.
 * - Nếu socket đang disconnect (vì token cũ hết hạn): reconnect ngay với token mới.
 */
export const updateSocketToken = (newToken: string): void => {
  currentToken = newToken;

  if (!socket) return;

  // Cập nhật auth cho lần reconnect tiếp theo
  socket.auth = { token: currentToken };

  // Nếu đang bị disconnect do token cũ expire → reconnect ngay
  if (!socket.connected) {
    console.log("[Socket] Token updated — reconnecting with new token");
    socket.connect();
  }
};

export const getSocket = (): Socket | null => socket;

export const closeSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentToken = "";
  }
};

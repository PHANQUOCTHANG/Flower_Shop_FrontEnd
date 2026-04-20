import { getSocket } from "@/lib/socket";
import { Message } from "./chatService";

// Tránh collision khi switch chat
let currentChatId: string | null = null;
let messageListenerCallback: ((message: Message) => void) | null = null;

// Tham gia vào chat room
export const joinChatRoom = (chatId: string) => {
  const socket = getSocket();
  if (!socket) {
    console.error("[Socket] Socket chưa được khởi tạo");
    return;
  }

  socket.emit("chat:join", chatId);
  console.log(`[Socket] Đã tham gia chat room: ${chatId}`);
};

// Rời khỏi chat room
export const leaveChatRoom = (chatId: string) => {
  const socket = getSocket();
  if (!socket) {
    console.error("[Socket] Socket chưa được khởi tạo");
    return;
  }

  socket.emit("chat:leave", chatId);
  console.log(`[Socket] Đã rời chat room: ${chatId}`);
};

// Gửi typing indicator
export const sendTyping = (chatId: string, isTyping: boolean) => {
  const socket = getSocket();
  if (!socket) return;

  socket.emit("chat:typing", { chatId, isTyping });
};

// Lắng nghe tin nhắn mới trong room chat
export const listenForNewMessages = (
  chatId: string,
  callback: (message: Message) => void,
) => {
  const socket = getSocket();
  if (!socket) {
    console.error("[Socket] Socket chưa được khởi tạo");
    return;
  }

  // Nếu đã lắng nghe chat khác, hãy xóa listener cũ trước
  if (currentChatId !== null && currentChatId !== chatId) {
    console.log("[Socket] Loại bỏ listener cho chat cũ:", currentChatId);
    removeNewMessageListener();
  }

  // Cập nhật chatId hiện tại và callback
  currentChatId = chatId;
  messageListenerCallback = callback;

  // Setup listener
  socket.on("chat:new_message", (message: Message) => {
    console.log("[Socket] Tin nhắn mới nhận được:", message);

    // Chỉ thực hiện callback nếu message thuộc chat hiện tại
    if (message.chatId === currentChatId && messageListenerCallback) {
      messageListenerCallback(message);
    }
  });

  console.log("[Socket] Đang lắng nghe tin nhắn cho chat:", chatId);
};

// Ngưng lắng nghe tin nhắn
export const removeNewMessageListener = () => {
  const socket = getSocket();
  if (!socket) return;

  console.log("[Socket] Loại bỏ message listener cho chat:", currentChatId);

  socket.off("chat:new_message");

  // Reset tracking
  currentChatId = null;
  messageListenerCallback = null;
};

// Lắng nghe typing indicator
export const listenForTyping = (
  callback: (data: { fromUserId: string; isTyping: boolean }) => void,
) => {
  const socket = getSocket();
  if (!socket) return;

  socket.on("chat:typing", (data) => {
    console.log("[Socket] Typing indicator:", data);
    callback(data);
  });
};

// Ngưng lắng nghe typing
export const removeTypingListener = () => {
  const socket = getSocket();
  if (!socket) return;

  socket.off("chat:typing");
};

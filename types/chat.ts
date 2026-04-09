export interface ChatUser {
  fullName: string;
  avatarUrl: string;
}

export interface ChatLastMessage {
  content: string;
  createdAt: string;
  senderRole?: "user" | "admin" | string;
}

export interface Chat {
  id: string;
  userId: string;
  status: string;
  lastMessageAt: string | null;
  user?: ChatUser;
  lastMessage?: ChatLastMessage | null;
  createdAt?: string;
  updatedAt?: string;
}

// Bổ sung alias cho Admin lấy danh sách phân trang nếu cần thiết
export type ChatItem = Chat;

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderRole: "user" | "admin" | string;
  content: string;
  createdAt: string;
}

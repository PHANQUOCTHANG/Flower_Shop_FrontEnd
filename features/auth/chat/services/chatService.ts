import api from "@/lib/axios";
import { ApiResponse } from "@/types/response";

import { Chat, Message } from "@/types/chat";
export type { Chat, Message };
export interface GetMessagesResponse {
  data: Message[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface SendMessageRequest {
  content: string;
}

interface GetChatMessagesParams {
  page?: number;
  limit?: number;
}

export const chatService = {
  // Lấy thông tin phòng chat cá nhân hoặc tạo nếu chưa có
  async getMyChat() {
    const res = await api.get<ApiResponse<Chat>>("/chats/me");

    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Lấy thông tin chat thất bại");
    }

    return res.data.data;
  },

  // Lấy danh sách tin nhắn từ một phòng chat
  async getChatMessages(chatId: string, params?: GetChatMessagesParams) {
    const res = await api.get<ApiResponse<GetMessagesResponse>>(
      `/chats/${chatId}/messages`,
      {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 20,
        },
      },
    );

    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Lấy danh sách tin nhắn thất bại");
    }

    return {
      messages: (res.data.data as unknown as Message[]) ?? [],
      total: res.data.meta?.total ?? 0,
      page: res.data.meta?.page ?? 1,
      limit: res.data.meta?.limit ?? 20,
      totalPages: res.data.meta?.totalPages ?? 1,
      hasMore: (res.data.meta as any)?.hasMore ?? ((res.data.meta?.page ?? 1) < (res.data.meta?.totalPages ?? 1)),
    };
  },

  // Gửi tin nhắn từ user
  async sendUserMessage(request: SendMessageRequest) {
    const res = await api.post<ApiResponse<Message>>(
      "/chats/me/messages",
      request,
    );

    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Gửi tin nhắn thất bại");
    }

    return res.data.data;
  },

  // Fetch chat và messages cùng lúc
  async initializeChat() {
    const chat = await this.getMyChat();
    const messagesData = await this.getChatMessages(chat.id, {
      page: 1,
      limit: 20,
    });

    return {
      chat,
      messages: messagesData,
    };
  },
};

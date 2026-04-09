"use client";

import api from "@/lib/axios";
import { ApiResponse } from "@/types/response";

import { Chat, ChatItem, Message } from "@/types/chat";
export type { Chat, ChatItem, Message };
// Query parameters cho pagination
interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "CLOSED";
}

// Response cho danh sách chat
interface ChatListResponse {
  data: ChatItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Response cho lịch sử tin nhắn
interface ChatMessagesResponse {
  data: Message[];
  chat: Chat;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Request gửi tin nhắn
interface SendMessageRequest {
  content: string;
}

export const adminChatService = {
  // Lấy danh sách cuộc hội thoại (inbox)
  async getChatList(params?: PaginationQuery): Promise<ChatListResponse> {
    try {
      const response = await api.get<ApiResponse<ChatItem[]>>(
        "/chats/admin/list",
        {
          params: {
            page: params?.page ?? 1,
            limit: params?.limit ?? 20,
            search: params?.search,
            status: params?.status,
          },
        },
      );

      const backendData = response.data.data;
      const actualMeta = response.data.meta;

      if (!backendData) {
        throw new Error("Response không chứa dữ liệu");
      }

      return {
        data: backendData,
        pagination: {
          total: actualMeta?.total ?? 0,
          page: actualMeta?.page ?? 1,
          limit: actualMeta?.limit ?? 20,
          totalPages: actualMeta?.totalPages ?? 1,
        },
      };
    } catch (error) {
      console.error("[Admin Chat Service] Lỗi lấy danh sách chat", error);
      throw error;
    }
  },

  // Lấy lịch sử tin nhắn của một cuộc hội thoại
  async getChatMessages(
    chatId: string,
    params?: PaginationQuery,
  ): Promise<ChatMessagesResponse> {
    try {
      const response = await api.get<ApiResponse<Message[]>>(
        `/chats/${chatId}/messages`,
        {
          params: {
            page: params?.page ?? 1,
            limit: params?.limit ?? 20,
          },
        },
      );

      const backendData = response.data.data;
      const actualMeta = response.data.meta;

      return {
        data: backendData ?? [],
        chat: {
          id: chatId,
          userId: "",
          status: "",
          lastMessageAt: null,
        },
        pagination: {
          total: actualMeta?.total ?? 0,
          page: actualMeta?.page ?? 1,
          limit: actualMeta?.limit ?? 20,
          totalPages: actualMeta?.totalPages ?? 1,
        },
      };
    } catch (error) {
      console.error("[Admin Chat Service] Lỗi lấy tin nhắn", error);
      throw error;
    }
  },

  // Gửi tin nhắn phản hồi cho khách hàng
  async sendMessage(
    chatId: string,
    { content }: SendMessageRequest,
  ): Promise<Message> {
    try {
      const response = await api.post<ApiResponse<Message>>(
        `/chats/${chatId}/messages`,
        { content },
      );

      const message = response.data.data;
      return message;
    } catch (error) {
      console.error("[Admin Chat Service] Lỗi gửi tin nhắn", error);
      throw error;
    }
  },

  // Tải thêm tin nhắn cũ hơn (pagination)
  async loadMoreMessages(
    chatId: string,
    page: number,
  ): Promise<ChatMessagesResponse> {
    return this.getChatMessages(chatId, { page });
  },

  // Tìm kiếm cuộc hội thoại theo tên khách hàng
  async searchChats(keyword: string): Promise<ChatListResponse> {
    return this.getChatList({ search: keyword });
  },

  // Lọc cuộc hội thoại theo trạng thái
  async filterChatsByStatus(
    status: "ACTIVE" | "CLOSED",
  ): Promise<ChatListResponse> {
    return this.getChatList({ status });
  },
};

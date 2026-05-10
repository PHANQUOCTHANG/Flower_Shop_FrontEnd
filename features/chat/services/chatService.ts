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
  content?: string;
  mediaUrl?: string;
  mediaPublicId?: string;
  mediaType?: string;
  mediaName?: string;
  mediaSize?: number;
}

export interface UploadMediaResponse {
  url: string;
  publicId: string;
  mediaType: "image" | "video" | "file";
  originalName: string;
  size: number;
}

interface GetChatMessagesParams {
  page?: number;
  limit?: number;
}

export const chatService = {
  // ─── ADMIN CHAT ──────────────────────────────────────────────
  async getMyChat() {
    const res = await api.get<ApiResponse<Chat>>("/chats/me");
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Lấy thông tin chat thất bại");
    }
    return res.data.data;
  },

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
      hasMore:
        (res.data.meta as any)?.hasMore ??
        (res.data.meta?.page ?? 1) < (res.data.meta?.totalPages ?? 1),
    };
  },

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

  async uploadMedia(file: File): Promise<UploadMediaResponse> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post<ApiResponse<UploadMediaResponse>>(
      "/chats/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Upload file thất bại");
    }
    return res.data.data as UploadMediaResponse;
  },

  async initializeChat() {
    const chat = await this.getMyChat();
    const messagesData = await this.getChatMessages(chat.id, {
      page: 1,
      limit: 20,
    });
    return { chat, messages: messagesData };
  },

  // ─── AI CHAT ─────────────────────────────────────────────────
  async getMyAIChat() {
    const res = await api.get<ApiResponse<Chat>>("/chats/ai/me");
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Lấy AI chat thất bại");
    }
    return res.data.data;
  },

  async sendAIMessage(request: SendMessageRequest) {
    const res = await api.post<ApiResponse<Message>>(
      "/chats/ai/messages",
      request,
    );
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Gửi tin nhắn AI thất bại");
    }
    return res.data.data;
  },
};

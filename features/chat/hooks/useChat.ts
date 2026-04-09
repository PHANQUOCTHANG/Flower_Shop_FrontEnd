"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { chatService, Chat, Message } from "../services/chatService";
import {
  joinChatRoom,
  leaveChatRoom,
  listenForNewMessages,
  removeNewMessageListener,
} from "../services/socketChatService";

export interface UseChatState {
  chat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  totalMessages: number;
  currentPage: number;
  hasMore: boolean;
}

export interface UseChatActions {
  openChat: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  closeChat: () => void;
  clearError: () => void;
}

// Hook useChat quản lý trạng thái chat và gọi API
export const useChat = () => {
  const [state, setState] = useState<UseChatState>({
    chat: null,
    messages: [],
    isLoading: false,
    isLoadingMore: false,
    error: null,
    totalMessages: 0,
    currentPage: 1,
    hasMore: true,
  });

  const isLoadingMoreRef = useRef(false);

  // Mở hộp thoại chat: lấy chat ID từ /me, sau đó lấy messages
  const openChat = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const chat = await chatService.getMyChat();

      if (!chat?.id) {
        throw new Error("Không lấy được chat ID");
      }

      const messagesData = await chatService.getChatMessages(chat.id, {
        page: 1,
        limit: 20,
      });

      // Tham gia room chat qua socket
      joinChatRoom(chat.id);

      setState((prev) => ({
        ...prev,
        chat,
        messages: messagesData.messages,
        totalMessages: messagesData.total,
        currentPage: 1,
        hasMore: messagesData.hasMore,
        isLoading: false,
      }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Không thể mở chat";
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      console.error("Lỗi mở chat:", err);
    }
  }, []);

  // Lắng nghe tin nhắn mới từ socket
  useEffect(() => {
    if (!state.chat) return;

    const handleNewMessage = (message: Message) => {
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
        totalMessages: prev.totalMessages + 1,
      }));
    };

    listenForNewMessages(state.chat.id, handleNewMessage);

    return () => {
      removeNewMessageListener();
    };
  }, [state.chat]);

  // Gửi tin nhắn
  const sendMessage = useCallback(async (content: string) => {
    try {
      // Check if chat exists before sending
      setState((prev) => {
        if (!prev.chat) {
          throw new Error("Không có chat để gửi tin nhắn");
        }
        return prev;
      });

      // Chỉ gửi API, message sẽ được thêm vào state từ socket listener
      // Để tránh duplicate message
      await chatService.sendUserMessage({ content });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Không thể gửi tin nhắn";
      setState((prev) => ({ ...prev, error: errorMessage }));
      console.error("Lỗi gửi tin nhắn:", err);
      throw err;
    }
  }, []);

  // Tải thêm tin nhắn cũ (pagination)
  const loadMoreMessages = useCallback(async () => {
    if (!state.chat || !state.hasMore || isLoadingMoreRef.current) {
      return;
    }

    isLoadingMoreRef.current = true;
    setState((prev) => ({ ...prev, isLoadingMore: true }));

    const nextPage = state.currentPage + 1;
    const chatId = state.chat.id;

    try {
      const messagesData = await chatService.getChatMessages(chatId, {
        page: nextPage,
        limit: 20,
      });

      setState((prev) => {
        // Tránh bị trùng lặp message bằng cách dùng Set
        const newMessageIds = new Set(prev.messages.map((m) => m.id));
        const filteredNewMessages = messagesData.messages.filter(
          (m) => !newMessageIds.has(m.id)
        );

        return {
          ...prev,
          // Thêm tin cũ ở đầu mảng
          messages: [...filteredNewMessages, ...prev.messages],
          currentPage: nextPage,
          hasMore: messagesData.hasMore,
          totalMessages: messagesData.total,
          isLoadingMore: false,
        };
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Không thể tải tin nhắn";
      console.error("[useChat] ❌ Lỗi tải thêm tin nhắn:", err);
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoadingMore: false,
      }));
    } finally {
      isLoadingMoreRef.current = false;
    }
  }, [state.chat, state.hasMore, state.currentPage]);

  // Đóng chat (reset state + rời room socket)
  const closeChat = useCallback(() => {
    setState((prev) => {
      if (prev.chat) {
        leaveChatRoom(prev.chat.id);
        removeNewMessageListener();
      }

      return {
        chat: null,
        messages: [],
        isLoading: false,
        isLoadingMore: false,
        error: null,
        totalMessages: 0,
        currentPage: 1,
        hasMore: true,
      };
    });
  }, []);

  // Xóa thông báo lỗi
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    openChat,
    sendMessage,
    loadMoreMessages,
    closeChat,
    clearError,
  } as UseChatState & UseChatActions;
};

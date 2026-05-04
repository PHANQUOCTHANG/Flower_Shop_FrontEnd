"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { chatService, Chat, Message } from "../services/chatService";
import {
  joinChatRoom,
  leaveChatRoom,
  listenForNewMessages,
  removeNewMessageListener,
} from "../services/socketChatService";

export interface UseAIChatState {
  chat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  isAITyping: boolean; // AI đang "gõ" — chờ response
  error: string | null;
  hasMore: boolean;
  currentPage: number;
}

export interface UseAIChatActions {
  openChat: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  closeChat: () => void;
  clearError: () => void;
}

export const useAIChat = () => {
  const [state, setState] = useState<UseAIChatState>({
    chat: null,
    messages: [],
    isLoading: false,
    isAITyping: false,
    error: null,
    hasMore: true,
    currentPage: 1,
  });

  const isLoadingMoreRef = useRef(false);

  // Mở AI chat: lấy chat info + messages cũ
  const openChat = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const chat = await chatService.getMyAIChat();
      if (!chat?.id) throw new Error("Không lấy được AI chat ID");

      const messagesData = await chatService.getChatMessages(chat.id, {
        page: 1,
        limit: 20,
      });

      // Join socket room để nhận AI response real-time
      joinChatRoom(chat.id);

      setState((prev) => ({
        ...prev,
        chat,
        messages: messagesData.messages,
        hasMore: messagesData.hasMore,
        currentPage: 1,
        isLoading: false,
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Hệ thống đang bận, vui lòng thử lại sau! 🌸";
      setState((prev) => ({ ...prev, error: msg, isLoading: false }));
    }
  }, []);

  // Lắng nghe tin nhắn mới từ socket (bao gồm AI response)
  useEffect(() => {
    if (!state.chat) return;

    const handleNewMessage = (message: Message) => {
      setState((prev) => {
        // Nếu là AI response → tắt typing indicator
        const isAIMsg =
          message.senderRole === "ai" ||
          message.senderId === "00000000-0000-0000-0000-000000000000";
        return {
          ...prev,
          messages: [...prev.messages, message],
          isAITyping: isAIMsg ? false : prev.isAITyping,
        };
      });
    };

    listenForNewMessages(state.chat.id, handleNewMessage);
    return () => {
      removeNewMessageListener();
    };
  }, [state.chat]);

  // Gửi tin nhắn đến AI
  const sendMessage = useCallback(
    async (content: string) => {
      if (!state.chat) return;
      try {
        // Bật typing indicator ngay khi gửi
        setState((prev) => ({ ...prev, isAITyping: true }));
        await chatService.sendAIMessage({ content });
        // Message user + AI response sẽ đến qua socket
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Không thể gửi tin nhắn, vui lòng thử lại sau!";
        setState((prev) => ({ ...prev, error: msg, isAITyping: false }));
        throw err;
      }
    },
    [state.chat],
  );

  // Load thêm tin cũ
  const loadMoreMessages = useCallback(async () => {
    if (!state.chat || !state.hasMore || isLoadingMoreRef.current) return;

    isLoadingMoreRef.current = true;
    const nextPage = state.currentPage + 1;
    const chatId = state.chat.id;

    try {
      const messagesData = await chatService.getChatMessages(chatId, {
        page: nextPage,
        limit: 20,
      });

      setState((prev) => {
        const existingIds = new Set(prev.messages.map((m) => m.id));
        const fresh = messagesData.messages.filter(
          (m) => !existingIds.has(m.id),
        );
        return {
          ...prev,
          messages: [...fresh, ...prev.messages],
          currentPage: nextPage,
          hasMore: messagesData.hasMore,
        };
      });
    } catch (err) {
      console.error("[useAIChat] Lỗi load thêm tin nhắn:", err);
    } finally {
      isLoadingMoreRef.current = false;
    }
  }, [state.chat, state.hasMore, state.currentPage]);

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
        isAITyping: false,
        error: null,
        hasMore: true,
        currentPage: 1,
      };
    });
  }, []);

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
  } as UseAIChatState & UseAIChatActions;
};
